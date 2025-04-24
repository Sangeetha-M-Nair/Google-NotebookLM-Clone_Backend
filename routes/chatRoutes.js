const express = require("express");
const axios = require("axios");
const pdfParse = require("pdf-parse");

const router = express.Router();


router.post("/", async (req, res) => {
  try {

    const { message, fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ error: "No file URL provided" });

    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    const pdfBuffer = Buffer.from(response.data);
   
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text; 
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
      
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

  
    const aiReply =
      openaiResponse.data.choices[0]?.message?.content?.trim() ||
      "No response from AI.";
    res.json({ reply: aiReply });
  } catch (error) {
   
  
    res.status(500).json({ error: "AI processing failed" });
  }
});

module.exports = router;
