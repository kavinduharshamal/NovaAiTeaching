//var userInput = document.getElementById("userInput").value;
//var userInput = document.getElementById("userInput").value;

const voice = require("elevenlabs-node"); // Correct import statement
const fileName = `audios/message.mp3`; // The name of your audio file
const textInput = "hi im kavindu"; // The text you wish to convert to speech
const elevenLabsApiKey = "eff3e54a7313f68f0b718d930621b3e1";
const voiceID = "kgG7dCoKCfLehAPWkJOE";
voice.textToSpeech(
  elevenLabsApiKey,
  voiceID,
  fileName,
  textInput,
  (err, response) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Speech generated successfully!");
    }
  }
);

// Display the message in the console
//console.log("User entered:", userInput);

/*
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/generateMessage", (req, res) => {
  const userMessage = req.body.message;
  console.log("User Message:", userMessage);
  res.json({ statu


// Display the message in the console
//console.log("User entered:", userInput);

/*
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/generateMessage", (req, res) => {
  const userMessage = req.body.message;
  console.log("User Message:", userMessage);
  res.json({ status: "success", message: "Message received on the server." });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
*/
