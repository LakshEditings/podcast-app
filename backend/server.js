import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Auth Routes
import authRoutes from './routes/auth.js';

// USER Routes
import userPodcastRoutes from './routes/userPodcasts.js';
import userEpisodeRoutes from './routes/userEpisodes.js';
import userLeaderboardRoutes from './routes/userLeaderboard.js';

// CREATOR Routes
import creatorPodcastRoutes from './routes/creatorPodcasts.js';
import creatorUploadRoutes from './routes/creatorUpload.js';

// ADMIN Routes
import adminManageRoutes from './routes/adminManage.js';
import audioRoutes from './routes/audio.js';

const app = express();

app.use(cors({
  origin: '*', // This allows all origins (good for testing)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Log requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Increase payload limits for large uploads via forms (100MB max)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve static audio files
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Audio Streaming Route (GridFS - Legacy fallback)
app.use('/api/audio', audioRoutes);

// Mount Auth
app.use('/api/auth', authRoutes);

// Mount User Routes
app.use('/api/user/podcasts', userPodcastRoutes);
app.use('/api/user/episodes', userEpisodeRoutes);
app.use('/api/user/leaderboard', userLeaderboardRoutes);

// Mount Creator Routes
app.use('/api/creator/podcasts', creatorPodcastRoutes);
app.use('/api/creator/upload', creatorUploadRoutes);

// Mount Admin Routes
app.use('/api/admin', adminManageRoutes);

// Health Check
app.get('/api/health', (req, res) => res.json({ service: 'podcast-unified-backend', status: 'ok' }));

const PORT = process.env.PORT || 5000;
console.log('--- SERVER STARTING ---');
connectDB().then(() => {
    console.log('--- DATABASE CONNECTED, STARTING EXPRESS ---');
    app.listen(PORT, () => {
        console.log(`🚀 Unified Backend running on http://10.70.2.24:${PORT}`);
    });
}).catch(err => {
    console.error('--- STARTUP ERROR ---', err);
});
