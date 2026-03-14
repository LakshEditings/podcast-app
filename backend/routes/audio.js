import { Router } from 'express';
import mongoose from 'mongoose';
import { GridFSBucket, MongoClient } from 'mongodb';

const router = Router();
let gfsBucket;

// Initialize GridFSBucket once connection is open
mongoose.connection.once('open', () => {
    try {
        const db = mongoose.connection.getClient().db(mongoose.connection.name);
        gfsBucket = new GridFSBucket(db, {
            bucketName: 'uploads'
        });
        console.log('[AudioStream] GridFS Bucket initialized using raw client');
    } catch (err) {
        console.error('[AudioStream] Failed to initialize GridFS:', err.message);
    }
});

// Stream audio file by filename or ID
router.get('/:id', async (req, res) => {
    console.log(`[AudioStream] Request for ID: ${req.params.id}`);
    
    try {
        // Fallback: create a temporary client if gfsBucket is not ready
        if (!gfsBucket) {
            console.log('[AudioStream] gfsBucket not ready, trying to init now...');
            const client = await MongoClient.connect(process.env.MONGO_URI);
            const db = client.db(); 
            gfsBucket = new GridFSBucket(db, { bucketName: 'uploads' });
        }

        const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        const query = isObjectId ? { _id: new mongoose.Types.ObjectId(req.params.id) } : { filename: req.params.id };

        const files = await gfsBucket.find(query).toArray();
        if (!files || files.length === 0) {
            console.error(`[AudioStream] File not found for: ${req.params.id}`);
            return res.status(404).json({ message: 'Audio file not found' });
        }

        const file = files[0];
        console.log(`[AudioStream] Found file: ${file.filename}, size: ${file.length}`);
        const fileSize = file.length;
        const range = req.headers.range;

        if (range) {
            console.log(`[AudioStream] Serving range: ${range}`);
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': file.contentType || 'audio/mpeg',
            });

            const downloadStream = gfsBucket.openDownloadStream(file._id, { start, end: end + 1 });
            downloadStream.pipe(res);
            
            let bytesSent = 0;
            downloadStream.on('data', (chunk) => {
                bytesSent += chunk.length;
            });
            downloadStream.on('error', (err) => {
                console.error('[AudioStream] Range Stream Error:', err.message);
            });
            downloadStream.on('end', () => {
                console.log(`[AudioStream] Range Stream Ended. Total sent: ${bytesSent}`);
            });
        } else {
            console.log('[AudioStream] Serving full file');
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': file.contentType || 'audio/mpeg',
            });
            const downloadStream = gfsBucket.openDownloadStream(file._id);
            downloadStream.pipe(res);
            
            let bytesSent = 0;
            downloadStream.on('data', (chunk) => {
                bytesSent += chunk.length;
            });
            downloadStream.on('error', (err) => {
                console.error('[AudioStream] Full Stream Error:', err.message);
            });
            downloadStream.on('end', () => {
                console.log(`[AudioStream] Full Stream Ended. Total sent: ${bytesSent}`);
            });
        }
    } catch (err) {
        console.error('[AudioStream] Critical Error:', err.message);
        if (!res.headersSent) {
            res.status(500).json({ message: err.message });
        }
    }
});

// Delete audio file by ID helper
export const deleteAudioFile = async (idOrFilename) => {
    if (!gfsBucket) return;
    try {
        const isObjectId = mongoose.Types.ObjectId.isValid(idOrFilename);
        const query = isObjectId ? { _id: new mongoose.Types.ObjectId(idOrFilename) } : { filename: idOrFilename };
        const files = await gfsBucket.find(query).toArray();
        if (files && files.length > 0) {
            await gfsBucket.delete(files[0]._id);
        }
    } catch (err) {
        console.error('Error deleting from GridFS:', err.message);
    }
};

export default router;
