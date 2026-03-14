import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

async function testChunksRaw() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('podcastApp');
        const fileId = new ObjectId('69b25a6efcf1b0df0a75fb9b');
        
        console.log(`Fetching first chunk for ${fileId}...`);
        const chunk = await db.collection('uploads.chunks').findOne({ files_id: fileId, n: 0 });
        
        if (chunk) {
            console.log(`Success! Chunk 0 found. Length: ${chunk.data.length} bytes`);
        } else {
            console.log('Chunk 0 NOT found.');
        }
    } catch (err) {
        console.error('Raw Chunk Error:', err);
    } finally {
        await client.close();
    }
}

testChunksRaw();
