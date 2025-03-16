const express = require("express");
const axios = require("axios");
const pdfParse = require("pdf-parse");

const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const fileUrl = req.body.fileUrl;
//     if (!fileUrl)
//       return res.status(400).json({ error: "No file URL provided" });
// const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
// const pdfBuffer = Buffer.from(response.data);
//     // const pdfFile = req.files.pdf;
//     // const pdfBuffer = pdfFile.data; // Extract file data

//     // Parse PDF content
//     const pdfData = await pdfParse(pdfBuffer);
//     const pdfText = pdfData.text; // Extracted text from PDF

//     const { message } = req.body;

//     const openaiResponse = await axios.post(
//       "https://api.openai.com/v1/completions",
//       {
//         model: "gpt-4",
//         prompt: `Based on the PDF content: ${pdfText}\nUser question: ${message}`,
//         max_tokens: 100,
//       },
//       {
//         headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
//       }
//     );

//     res.json({ reply: openaiResponse.data.choices[0].text.trim() });
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "AI processing failed" });
//   }
// });

router.post("/", async (req, res) => {
  try {
    // ✅ 1. Log incoming request data
    console.log("Received request body:", req.body);

    const { message, fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ error: "No file URL provided" });

    // ✅ 2. Fetch the PDF file
    console.log("Fetching PDF from:", fileUrl);
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    // ✅ 3. Convert the fetched PDF to a Buffer
    const pdfBuffer = Buffer.from(response.data);
    console.log("PDF fetched successfully!");

    // ✅ 4. Parse the PDF content
    console.log("Parsing PDF...");
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text; // Extract text content
    console.log("PDF parsed successfully!");

    // ✅ 5. Send request to OpenAI API
    console.log("Sending request to OpenAI API...");
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that answers questions based on provided PDF content.",
          },
          {
            role: "user",
            content: `PDF Content:\n${pdfText}\n\nUser Question: ${message}`,
          },
        ],
        // prompt: `Based on the PDF content: ${pdfText}\nUser question: ${message}`,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ 6. Log AI response and return to frontend
    console.log("OpenAI API Response:", openaiResponse.data);
    // res.json({ reply: openaiResponse.data.choices[0].text.trim() });
    const aiReply =
      openaiResponse.data.choices[0]?.message?.content?.trim() ||
      "No response from AI.";
    res.json({ reply: aiReply });
  } catch (error) {
    // ✅ 7. Handle different errors properly
    if (error.response) {
      console.error("Error from OpenAI API:", error.response.data);
    } else {
      console.error("Unexpected Error:", error.message);
    }
    res.status(500).json({ error: "AI processing failed" });
  }
});

module.exports = router;
