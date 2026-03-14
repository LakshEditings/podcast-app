import { MongoClient, ObjectId, GridFSBucket } from 'mongodb';
import 'dotenv/config';

async function testDownload() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('podcastApp');
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        const fileId = new ObjectId('69b25a6efcf1b0df0a75fb9b');
        
        console.log(`Starting download for ${fileId}...`);
        const stream = bucket.openDownloadStream(fileId);
        
        await new Promise((resolve, reject) => {
            let received = 0;
            stream.on('data', (chunk) => {
                received += chunk.length;
                console.log(`Received chunk: ${chunk.length} bytes (Total: ${received})`);
            });
            stream.on('error', (err) => {
                console.error('Download Error:', err);
                reject(err);
            });
            stream.on('end', () => {
                console.log('Download Finished.');
                resolve();
            });
        });
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        console.log('Client closed.');
    }
}

testDownload();
