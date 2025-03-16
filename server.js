require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const pdfRoutes = require("./routes/pdfRoutes");
const chatRoutes = require("./routes/chatRoutes");
const app = express();

// const fileUpload = require("express-fileupload");

// app.use(fileUpload()); // Middleware to parse files
// app.use(cors({ origin: "*" }));
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend access
    credentials: true,
  })
);
app.use(express.json());

// app.use("/uploads", express.static("uploads"));
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// Configure Multer to save files in the "uploads" directory

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

app.use("/api/pdf", pdfRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
