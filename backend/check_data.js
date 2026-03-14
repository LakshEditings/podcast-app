import 'dotenv/config';
import mongoose from 'mongoose';
import Episode from './models/Episode.js';

async function checkEpisodes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const latestEpisode = await Episode.findOne().sort({ createdAt: -1 });
        console.log('--- LATEST EPISODE ---');
        console.log(JSON.stringify(latestEpisode, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkEpisodes();
