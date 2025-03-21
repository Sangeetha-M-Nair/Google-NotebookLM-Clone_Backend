const express = require("express");
const multer = require("multer");
const Pdf = require("../models/PdfModel");
const path = require("path");

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Specify the directory to save the files
//   },
//   filename: (req, file, cb) => {
//     const uniqueFilename = Date.now() + path.extname(file.originalname); // Use current timestamp as filename
//     console.log("Generated filename:", uniqueFilename); // Log the generated filename
//     cb(null, uniqueFilename);
//   },
// });


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





// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     console.log("Multer File Object:", req.file); // DEBUGGING

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // const fileUrl = `https://google-notebooklm-clone-backend.onrender.com/api/pdf/upload/${req.file.filename}`; // Use the filename generated by multer
//   const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
//     req.file.filename
//   }`;

//     // Save file details to MongoDB
//     const newPdf = new Pdf({ filename: req.file.originalname, fileUrl });
//     await newPdf.save();

//     console.log("File uploaded successfully:", fileUrl);
//     res.json({ success: true, fileUrl });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });


// 🔹 Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Uploaded File:", req.file); // ✅ Debugging

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = req.file.path; // ✅ Cloudinary automatically provides a file URL

    // 🔹 Save file details to MongoDB
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
