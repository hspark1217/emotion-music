const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  input: { type: String, required: true },
  keyword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema);

