import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import voice from "elevenlabs-node";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
dotenv.config();

const elevenLabsApiKey = "eff3e54a7313f68f0b718d930621b3e1";
const voiceID = "5Q0t7uMcjvnagumLfvZi";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

//file uploader system//////////////////////////////////////////
// Get the current module's directory using import.meta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/texture")); // Set your desired upload folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve static files in the uploads folder

app.use("/uploads", express.static(path.join(__dirname, "public/texture")));

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully!" });
});
app.post("/Teacher", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  // Example validation
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  try {
    // Assuming you have a function to save the user
    await saveUserToDatabase({ firstname, lastname, email, password });
    res.status(200).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .send({ error: "Error creating account. Please try again." });
  }
});

/////////////////

const addUserNameToData = async (
  userName,
  userBatch,
  moduleName,
  moduleCode,
  duration,
  texture
) => {
  try {
    // Step 1: Read the existing data.json file
    const jsonData = await fs.readFile("data.json", "utf8");
    //take tha time of content
    const timeData = await fs.readFile(`public/audio/${userName}.json`, "utf8");
    const duration = JSON.parse(timeData)?.metadata?.duration;
    console.log(duration);
    // Step 2: Parse the JSON content
    const existingData = JSON.parse(jsonData);

    // Step 3: Append the new user information
    const newUser = {
      id: userName,
      department: moduleCode,
      ModuleName: moduleName,
      Time: duration,
      Batch: userBatch,
      texture: `texture/${texture}`,
    };
    existingData.push(newUser);

    // Step 4: Write the updated JSON back to file
    await fs.writeFile("data.json", JSON.stringify(existingData, null, 2));

    console.log(`User "${userName}" added to data.json successfully.`);
  } catch (error) {
    console.error("Error appending user to data.json:", error);
  }
};

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);
  await execCommand(
    `ffmpeg -y -i public/audio/${message}.mp3 public/audio/${message}.wav`
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `./Rhubarb-Lip/rhubarb -f json public/audio/${message}.wav -o public/audio/${message}.json `
  );
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

app.post("/voice", async (req, res) => {
  const userMessage = req.body.message;
  const userName = req.body.name;
  const userBatch = req.body.batch;
  const moduleName = req.body.moduleName;
  const moduleCode = req.body.moduleCode;
  const texture = req.body.texture;
  console.log(userName);
  console.log(userBatch);
  console.log(moduleName);
  console.log(moduleCode);
  console.log(texture);

  if (!userMessage) {
    res.status(400).send({ error: "Message is required" });
    return;
  }

  if (!elevenLabsApiKey) {
    res.status(400).send({ error: "ElevenLabs API key is missing" });
    return;
  }

  try {
    // Create ElevenLabs API call
    const fileName = `public/audio/${userName}.mp3`;
    await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, userMessage);

    // Convert audio file to base64
    const audioBase64 = await audioFileToBase64(fileName);

    // Generate lipsync
    await lipSyncMessage(userName);

    // Read lipsync JSON
    const lipsync = await readJsonTranscript(`public/audio/${userName}.json`);
    //get the time of voice clip

    addUserNameToData(
      userName,
      userBatch,
      moduleName,
      moduleCode,
      "12",
      texture
    );

    res.send({ audio: audioBase64, lipsync });
  } catch (error) {
    console.error("Error processing voice request:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  console.log(`AI teacher listening on port ${port}`);
});
