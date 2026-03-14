import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

async function testSmall() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('podcastApp');
        const fileId = new ObjectId('69b25a6efcf1b0df0a75fb9b');
        
        console.log(`Fetching chunk metadata for ${fileId}...`);
        const chunk = await db.collection('uploads.chunks').findOne(
            { files_id: fileId, n: 0 },
            { projection: { data: 0 } } // DO NOT FETCH BINARY DATA
        );
        
        if (chunk) {
            console.log('Success! Metadata found:', JSON.stringify(chunk, null, 2));
        } else {
            console.log('Chunk metadata NOT found.');
        }
    } catch (err) {
        console.error('Metadata Fetch Error:', err);
    } finally {
        await client.close();
    }
}

testSmall();
