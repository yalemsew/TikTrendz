const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  // 其他字段...
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
