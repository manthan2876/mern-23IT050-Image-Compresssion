import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  originalSize: { type: Number, required: true },
  compressedSize: { type: Number, required: true },
  compressionRatio: { type: Number, required: true },
  compressedPath: { type: String, required: true },
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
export { Image };