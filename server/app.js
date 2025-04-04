import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import imageRoutes from './routes/imageRoutes.js';
import { logger } from './config/logger.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/analytics', imageRoutes);
app.use('/api/images/:id/download', imageRoutes);
app.use('/api/images/:id', imageRoutes); 

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
