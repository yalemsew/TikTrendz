const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userName: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
