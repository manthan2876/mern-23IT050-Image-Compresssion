// === server/routes/imageRoutes.js ===
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { Image } from '../models/image.js';
import { logger } from '../config/logger.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload & Compress Image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const originalPath = req.file.path;
    const compressedPath = `uploads/compressed-${req.file.filename}.jpg`;

    // Compress image
    await sharp(originalPath)
      .resize(800)
      .jpeg({ quality: 70 })
      .toFile(compressedPath);

    const originalSize = fs.statSync(originalPath).size;
    const compressedSize = fs.statSync(compressedPath).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    // Save image data to MongoDB
    const image = new Image({
      originalName: req.file.originalname,
      originalSize,
      compressedSize,
      compressionRatio,
      compressedPath
    });
    await image.save();

    fs.unlinkSync(originalPath); // Delete original file after compression
    logger.info(`Image uploaded: ${req.file.originalname} (Saved ${compressionRatio.toFixed(2)}%)`);

    res.json(image);
  } catch (err) {
    logger.error('Image Upload Error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});


// Fetch Uploaded Images
router.get('/', async (req, res) => {
    try {
      const images = await Image.find().sort({ createdAt: -1 });
      res.json(images);
    } catch (err) {
      logger.error('Fetch Images Error:', err);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  });
  
  // Download Compressed Image
router.get('/:id/download', async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) return res.status(404).json({ error: 'Image not found' });
  
      res.download(image.compressedPath);
      logger.info(`Image downloaded: ${image.originalName}`);
    } catch (err) {
      logger.error('Download Image Error:', err);
      res.status(500).json({ error: 'Failed to download image' });
    }
  });
  
  router.get('/analytics', async (req, res) => {
    try {
      const totalCompressions = await Image.countDocuments();
      const totalOriginalSize = await Image.aggregate([
        { $group: { _id: null, total: { $sum: '$originalSize' } } }
      ]);
      const totalCompressedSize = await Image.aggregate([
        { $group: { _id: null, total: { $sum: '$compressedSize' } } }
      ]);
  
      const totalOriginal = totalOriginalSize[0]?.total || 0;
      const totalCompressed = totalCompressedSize[0]?.total || 0;
      const totalSaved = totalOriginal - totalCompressed;
      const totalSavedPercent = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(2) : 0;
  
      res.json({
        totalCompressions,
        totalOriginalSize: (totalOriginal / 1024).toFixed(2), // in KB
        totalCompressedSize: (totalCompressed / 1024).toFixed(2),
        totalSizeSaved: (totalSaved / 1024).toFixed(2),
        totalSavedPercent
      });
    } catch (err) {
      logger.error('Analytics Fetch Error:', err);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  export default router;