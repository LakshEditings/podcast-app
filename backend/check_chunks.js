import 'dotenv/config';
import mongoose from 'mongoose';

async function checkChunks() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const fileId = new mongoose.Types.ObjectId('69b25a6efcf1b0df0a75fb9b');
        const chunksCount = await mongoose.connection.db.collection('uploads.chunks').countDocuments({ files_id: fileId });
        console.log(`--- CHUNKS FOR ${fileId} ---`);
        console.log(`Count: ${chunksCount}`);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkChunks();
