const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String },
  title: { type: String },
  meta: { type: Object },
  smythosId: { type: String },
  storageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);
