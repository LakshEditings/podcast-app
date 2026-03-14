import { Router } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import Podcast from '../models/Podcast.js';
import Episode from '../models/Episode.js';
import Quiz from '../models/Quiz.js';
import PollFlag from '../models/PollFlag.js';
import { auth } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
// Use disk storage for reliability
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } 
});

// Get creator's podcasts
router.get('/', auth, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ creator: req.user.id }).sort({ createdAt: -1 });
        res.json(podcasts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get podcast detail
router.get('/:id', auth, async (req, res) => {
    try {
        const podcast = await Podcast.findOne({ _id: req.params.id, creator: req.user.id });
        if (!podcast) return res.status(404).json({ message: 'Not found' });
        const episodes = await Episode.find({ podcast: podcast._id }).sort({ createdAt: -1 });
        res.json({ podcast, episodes });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Upload podcast
router.post('/', auth, upload.any(), async (req, res) => {
    try {
// Removed gfs check
        const { title, description, category, language, creatorName } = req.body;
        const episodesData = JSON.parse(req.body.episodes || '[]');

        const podcast = await Podcast.create({
            title, description, emoji: '🎧', category, language,
            creator: req.user.id, creatorName, episodeCount: episodesData.length,
        });

        const createdEpisodes = [];
        for (let i = 0; i < episodesData.length; i++) {
            const ep = episodesData[i];
            const audioFile = req.files?.find(f => f.fieldname === `audioFile_${i}`);
            
            let audioPath = '';
            if (audioFile) {
                audioPath = `/uploads/${audioFile.filename}`;
            }

            const episode = await Episode.create({
                podcast: podcast._id, title: ep.title,
                description: ep.description, duration: ep.duration,
                captions: ep.captions || '', audioFile: audioPath,
            });

            if (ep.quizzes?.length > 0) {
                const valid = ep.quizzes.filter(q => q.question?.trim());
                if (valid.length > 0) await Quiz.create({ episode: episode._id, questions: valid });
            }

            if (ep.pollFlags?.length > 0) {
                const valid = ep.pollFlags.filter(f => f.question?.trim());
                if (valid.length > 0) {
                    await PollFlag.create({
                        episode: episode._id,
                        flags: valid.map(f => ({
                            percentage: f.percentage, question: f.question,
                            options: f.options.filter(o => o.trim()).map(o => ({ text: o, votes: 0 })),
                        })),
                    });
                }
            }
            createdEpisodes.push(episode);
        }
        res.status(201).json({ podcast, episodes: createdEpisodes });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Edit podcast
router.put('/:id', auth, upload.any(), async (req, res) => {
    try {
// Removed gfs check
        const podcast = await Podcast.findOne({ _id: req.params.id, creator: req.user.id });
        if (!podcast) return res.status(404).json({ message: 'Not found' });

        const hoursSinceCreation = (Date.now() - new Date(podcast.createdAt).getTime()) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) return res.status(403).json({ message: 'Edit window expired' });

        const { title, description, category, language } = req.body;
        const podcastEdits = [];
        const now = new Date();

        if (title && title !== podcast.title) { podcastEdits.push({ field: 'Title', oldValue: podcast.title, newValue: title, editedAt: now }); podcast.title = title; }
        if (description && description !== podcast.description) { podcastEdits.push({ field: 'Description', oldValue: podcast.description, newValue: description, editedAt: now }); podcast.description = description; }
        if (category && category !== podcast.category) { podcastEdits.push({ field: 'Category', oldValue: podcast.category, newValue: category, editedAt: now }); podcast.category = category; }
        if (language && language !== podcast.language) { podcastEdits.push({ field: 'Language', oldValue: podcast.language, newValue: language, editedAt: now }); podcast.language = language; }

        if (podcastEdits.length > 0) {
            podcast.editHistory = [...(podcast.editHistory || []), ...podcastEdits];
            await podcast.save();
        }

        const episodesData = req.body.episodes ? JSON.parse(req.body.episodes) : null;
        if (episodesData) {
            const existingEpisodes = await Episode.find({ podcast: podcast._id }).sort({ createdAt: 1 });
            for (let i = 0; i < episodesData.length; i++) {
                const epData = episodesData[i];
                const existingEp = existingEpisodes[i];
                if (existingEp) {
                    const epEdits = [];
                    if (epData.title && epData.title !== existingEp.title) { epEdits.push({ field: 'Title', oldValue: existingEp.title, newValue: epData.title, editedAt: now }); existingEp.title = epData.title; }
                    if (epData.description !== undefined && epData.description !== existingEp.description) { epEdits.push({ field: 'Description', oldValue: existingEp.description, newValue: epData.description, editedAt: now }); existingEp.description = epData.description; }
                    if (epData.duration && epData.duration !== existingEp.duration) { epEdits.push({ field: 'Duration', oldValue: existingEp.duration, newValue: epData.duration, editedAt: now }); existingEp.duration = epData.duration; }

                    const audioFile = req.files?.find(f => f.fieldname === `audioFile_${i}`);
                    if (audioFile) {
                        const newPath = `/uploads/${audioFile.filename}`;
                        epEdits.push({ field: 'Audio File', oldValue: existingEp.audioFile || 'none', newValue: newPath, editedAt: now });
                        existingEp.audioFile = newPath;
                    }
                    if (epEdits.length > 0) {
                        existingEp.editHistory = [...(existingEp.editHistory || []), ...epEdits];
                        await existingEp.save();
                    }
                }
            }
        }
        const allEpisodes = await Episode.find({ podcast: podcast._id }).sort({ createdAt: 1 });
        res.json({ podcast, episodes: allEpisodes, message: 'Updated successfully' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete podcast
router.delete('/:id', auth, async (req, res) => {
    try {
        const podcast = await Podcast.findOne({ _id: req.params.id, creator: req.user.id });
        if (!podcast) return res.status(404).json({ message: 'Not found' });
        const episodes = await Episode.find({ podcast: podcast._id });
        for (const ep of episodes) {
            if (ep.audioFile && ep.audioFile.startsWith('/uploads/')) {
                const filePath = path.join(__dirname, '..', ep.audioFile);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            await Quiz.deleteMany({ episode: ep._id });
            await PollFlag.deleteMany({ episode: ep._id });
        }
        await Episode.deleteMany({ podcast: podcast._id });
        await podcast.deleteOne();
        res.json({ message: 'Podcast deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Analytics
router.get('/analytics/summary', auth, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ creator: req.user.id });
        const episodes = await Episode.find({ podcast: { $in: podcasts.map(p => p._id) } });
        res.json({
            totalPodcasts: podcasts.length, totalEpisodes: episodes.length,
            totalListens: episodes.reduce((s, e) => s + e.listens, 0),
            totalSubscribers: podcasts.reduce((s, p) => s + p.subscribers, 0),
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
