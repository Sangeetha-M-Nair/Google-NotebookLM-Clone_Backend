const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema({
  filename: String,
  fileUrl: String,
});

module.exports = mongoose.model("Pdf", PdfSchema);
