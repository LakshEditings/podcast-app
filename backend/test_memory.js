import { MongoClient, ObjectId, GridFSBucket } from 'mongodb';
import 'dotenv/config';

async function testMemory() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('podcastApp');
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        const fileId = new ObjectId('69b25a6efcf1b0df0a75fb9b');
        
        console.log(`Pulling ${fileId} into memory...`);
        const startTime = Date.now();
        
        const chunks = await db.collection('uploads.chunks').find({ files_id: fileId }).sort({ n: 1 }).toArray();
        console.log(`Found ${chunks.length} chunks.`);
        
        let totalSize = 0;
        for (const chunk of chunks) {
            totalSize += chunk.data.buffer.byteLength;
        }
        
        const endTime = Date.now();
        console.log(`Success! Loaded ${totalSize} bytes in ${endTime - startTime}ms`);
    } catch (err) {
        console.error('Memory Pull Error:', err);
    } finally {
        await client.close();
    }
}

testMemory();
