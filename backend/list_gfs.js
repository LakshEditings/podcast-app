import 'dotenv/config';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

async function listFiles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const gfs = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });
        const files = await gfs.find({}).toArray();
        console.log('--- GRIDFS FILES ---');
        console.log(JSON.stringify(files, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listFiles();
