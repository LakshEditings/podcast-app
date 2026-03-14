import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function checkCollections() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected.');
        const db = client.db('podcastApp');
        const colls = await db.listCollections().toArray();
        console.log('Collections:', colls.map(c => c.name));
        
        for (const col of colls) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`${col.name}: ${count} documents`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

checkCollections();
