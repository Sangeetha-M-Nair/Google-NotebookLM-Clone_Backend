const express = require("express");
const multer = require("multer");
const Pdf = require("../models/PdfModel");
const path = require("path");

const router = express.Router();




const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pdf_uploads",
    resource_type: "raw",
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Uploaded File:", req.file); // ✅ Debugging

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = req.file.path; 

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
