const axios = require("axios");

const chatWithPDF = async (req, res) => {
  try {
    const { pdfUrl, question } = req.body;

    // call python service
    const response = await axios.post(
      "http://localhost:8000/chat/pdf",
      {
        pdfUrl,
        question,
      }
    );

    res.json({
      answer: response.data.answer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
};
module.exports = {
  chatWithPDF,
};