const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

const fileModel = mongoose.model("files", fileSchema);

module.exports = fileModel;
