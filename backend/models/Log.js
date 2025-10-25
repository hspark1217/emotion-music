const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  input: String,
  keyword: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);

