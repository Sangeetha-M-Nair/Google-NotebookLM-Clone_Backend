const express = require("express");
const multer = require("multer");
const Pdf = require("../models/PdfModel");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to save the files
  },
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + path.extname(file.originalname); // Use current timestamp as filename
    console.log("Generated filename:", uniqueFilename); // Log the generated filename
    cb(null, uniqueFilename);
  },
});




const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Multer File Object:", req.file); // DEBUGGING

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`; // Use the filename generated by multer

    // Save file details to MongoDB
    const newPdf = new Pdf({ filename: req.file.originalname, fileUrl });
    await newPdf.save();

    console.log("File uploaded successfully:", fileUrl);
    res.json({ success: true, fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
