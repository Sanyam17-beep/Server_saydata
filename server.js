const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");
const app = express();
require("dotenv").config();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors());
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file");
  }
  const OPENAI_API_KEY = process.env.KEY;
  const model = "whisper-1";
  const formData = new FormData();
  formData.append("model", model);
  formData.append("file", req.file.buffer, req.file.originalname);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Organization': 'org-iQfGAiyIFj9zVfNkQI2ogNsb',
        },
      }
    );
    res.json({ transcription: response.data.text });
  } catch (error) {
    console.error(error);
    res.status(500).send("Transcription Error");
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server on port:${PORT}`);
});
