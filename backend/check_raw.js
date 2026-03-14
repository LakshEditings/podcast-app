import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

async function checkRaw() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected.');
        const db = client.db('podcastApp');
        const fileId = new ObjectId('69b25a6efcf1b0df0a75fb9b');
        console.log(`Checking chunks for ${fileId}...`);
        const count = await db.collection('uploads.chunks').countDocuments({ files_id: fileId });
        console.log(`Count: ${count}`);
        
        const fileInfo = await db.collection('uploads.files').findOne({ _id: fileId });
        console.log('File Info:', JSON.stringify(fileInfo, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

checkRaw();
