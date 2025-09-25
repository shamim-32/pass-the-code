const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  originalName: String,
  size: Number,
  mimeType: String,
  path: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', UploadSchema);
