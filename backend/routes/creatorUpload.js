import multer from 'multer';
import { Router } from 'express';
import mongoose from 'mongoose';
import { Readable } from 'stream';

const router = Router();

// Use disk storage for reliability
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});

// Simplified Upload Route
router.post('/', upload.array('audioFiles', 20), async (req, res) => {
    try {
        // Empty replacement - gfs check not needed

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        const files = req.files.map(file => ({
            filename: file.filename,
            path: `/uploads/${file.filename}`, // Path where the file is stored on disk
            mimetype: file.mimetype,
            size: file.size
        }));

        res.json({ message: `${files.length} file(s) uploaded to disk`, files });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
