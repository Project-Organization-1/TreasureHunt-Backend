const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  groupId: { type: String, required: true },
  email: {type: String },
  });

const User = mongoose.model('User', userSchema);

module.exports = User;