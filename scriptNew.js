import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import voice from "elevenlabs-node";
import path from "path";
import { promises as fsPromises } from "fs"; // Async file operations
import * as fsSync from "fs"; // Sync file operations like existsSync
import { fileURLToPath } from "url";
import multer from "multer"; // For handling file uploads

dotenv.config();

const elevenLabsApiKey = "eff3e54a7313f68f0b718d930621b3e1"; // Your ElevenLabs API key
const voiceID = "5Q0t7uMcjvnagumLfvZi"; // Your ElevenLabs Voice ID

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { moduleCode, nameOfLecture, batchId } = req.body;
    const folderPath = path.join(
      __dirname,
      `public/audio/${moduleCode}_${nameOfLecture}_${batchId}`
    );
    if (!fsSync.existsSync(folderPath)) {
      fsSync.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}.png`); // Save as file1.png, file2.png, etc.
  },
});

// Only allow image files (png, jpeg)
// Only allow image files (png, jpeg)
const fileFilter = (req, file, cb) => {
  console.log("File received:", file); // Debugging line to check file details

  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    console.error("Invalid file type:", file.mimetype); // Log the invalid file type
    cb(new Error("Invalid file type, only PNG and JPEG is allowed!"), false);
  }
};

// Configure multer middleware for handling multiple files
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).any(); // Allows uploading any file fields

// Function to add user data to data.json
const addUserNameToData = async (
  moduleCode,
  nameOfLecture,
  batchId,
  duration,
  texture,
  folderPath
) => {
  try {
    const filePath = path.join(folderPath, "data.json");
    let existingData = [];

    if (fsSync.existsSync(filePath)) {
      const jsonData = await fsPromises.readFile(filePath, "utf8");
      existingData = JSON.parse(jsonData);
    }

    const newUser = {
      id: moduleCode,
      department: moduleCode,
      ModuleName: nameOfLecture,
      Time: duration,
      Batch: batchId,
      texture: texture,
    };
    existingData.push(newUser);
    await fsPromises.writeFile(filePath, JSON.stringify(existingData, null, 2));
    console.log(`Data added successfully to ${filePath}`);
  } catch (error) {
    console.error("Error updating data.json:", error);
  }
};

// Main POST request to handle lecture generation with multiple file uploads
app.post("/generateLecture", upload, async (req, res) => {
  const { moduleCode, nameOfLecture, batchId, contents } = req.body;

  if (!moduleCode || !nameOfLecture || !batchId || !contents) {
    return res.status(400).send({ error: "All fields are required" });
  }

  try {
    const folderPath = path.join(
      __dirname,
      `public/audio/${moduleCode}_${nameOfLecture}_${batchId}`
    );

    // Ensure the folder path exists
    if (!fsSync.existsSync(folderPath)) {
      await fsPromises.mkdir(folderPath, { recursive: true });
    }

    // Check for file uploads for each content
    for (let i = 0; i < contents.length; i++) {
      const contentId = contents[i].id;
      const uploadedFile = req.files.find(
        (file) => file.fieldname === `${i + 1}`
      );

      if (uploadedFile) {
        console.log(`File uploaded successfully: ${uploadedFile.filename}`);
      } else {
        return res.status(400).send({
          error: `File upload is required for content ID: ${contentId}`,
        });
      }
    }

    // Phase 1: Generate all MP3 files
    console.log(`Starting Phase 1: Generating MP3 files`);
    for (let index = 0; index < contents.length; index++) {
      const { id, content: messageContent } = contents[index];
      const fileName = `${id}`;
      const mp3Path = path.join(folderPath, `${fileName}.mp3`);

      console.log(`Generating MP3 for content ID: ${id}, index: ${index}`);

      try {
        await voice.textToSpeech(
          elevenLabsApiKey,
          voiceID,
          mp3Path,
          messageContent
        );
        console.log(`MP3 generated for content ID: ${id}, index: ${index}`);
      } catch (err) {
        console.error(
          `Error generating MP3 for content ID: ${id}, index: ${index}`
        );
        continue; // Skip if MP3 generation fails
      }
    }

    // Phase 2: Convert all MP3 files to WAV
    console.log(`Starting Phase 2: Converting MP3 to WAV`);
    for (let index = 0; index < contents.length; index++) {
      const { id } = contents[index];
      const fileName = `${id}`;

      try {
        const mp3FilePath = path.join(folderPath, `${fileName}.mp3`);
        const wavFilePath = path.join(folderPath, `${fileName}.wav`);

        console.log(`Converting MP3 to WAV for: ${fileName}`);
        await new Promise((resolve, reject) => {
          exec(
            `ffmpeg -y -i "${mp3FilePath}" "${wavFilePath}"`,
            (error, stdout, stderr) => {
              if (error) {
                console.error(
                  `Error converting MP3 to WAV for content ID: ${id}, index: ${index}`,
                  stderr
                );
                return reject(error);
              }
              console.log(
                `WAV generated for content ID: ${id}, index: ${index}: ${stdout}`
              );
              resolve();
            }
          );
        });
      } catch (err) {
        console.error(
          `Error converting MP3 to WAV for content ID: ${id}, index: ${index}`
        );
        continue; // Skip if WAV generation fails
      }
    }

    // Phase 3: Generate JSON files from WAV
    console.log(`Starting Phase 3: Generating JSON from WAV`);
    for (let index = 0; index < contents.length; index++) {
      const { id } = contents[index];
      const fileName = `${id}`;
      const wavFilePath = `"${path.join(folderPath, `${fileName}.wav`)}"`;
      const jsonFilePath = `"${path.join(folderPath, `${fileName}.json`)}"`;

      try {
        console.log(`Generating JSON for: ${fileName}`);
        await new Promise((resolve, reject) => {
          exec(
            `./Rhubarb-Lip/rhubarb -f json ${wavFilePath} -o ${jsonFilePath}`,
            (error, stdout, stderr) => {
              if (error) {
                console.error(
                  `Error generating JSON for content ID: ${id}, index: ${index}`,
                  stderr
                );
                return reject(error);
              }
              console.log(
                `JSON generated for content ID: ${id}, index: ${index}: ${stdout}`
              );
              resolve();
            }
          );
        });
      } catch (err) {
        console.error(
          `Unexpected error generating JSON for content ID: ${id}, index: ${index}`,
          err
        );
      }
    }

    // Once all phases are complete, update data.json
    await addUserNameToData(
      moduleCode,
      nameOfLecture,
      batchId,
      "12", // Placeholder for duration
      "texture", // Placeholder for texture
      folderPath
    );

    res.status(200).send({ message: "Lecture generated successfully!" });
  } catch (error) {
    console.error("Error generating lecture:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// New API endpoint to count audio files in a folder
app.get("/countAudioFiles", async (req, res) => {
  const { fileName } = req.query;

  if (!fileName) {
    return res
      .status(400)
      .send({ error: "fileName query parameter is required" });
  }

  try {
    const folderPath = path.join(__dirname, "public/audio/", fileName);

    if (!fsSync.existsSync(folderPath)) {
      return res.status(404).send({ error: "Folder not found" });
    }

    const files = await fsPromises.readdir(folderPath);
    const audioFiles = files.filter((file) => file.endsWith(".mp3"));

    res.status(200).send({ audioFileCount: audioFiles.length });
  } catch (error) {
    console.error("Error counting audio files:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/countPngFiles", async (req, res) => {
  const { fileName } = req.query;

  if (!fileName) {
    return res
      .status(400)
      .send({ error: "fileName query parameter is required" });
  }

  try {
    const folderPath = path.join(__dirname, "public/audio/", fileName);

    if (!fsSync.existsSync(folderPath)) {
      return res.status(404).send({ error: "Folder not found" });
    }

    const files = await fsPromises.readdir(folderPath);
    const pngFiles = files.filter((file) => file.endsWith(".png"));

    res.status(200).send({ pngFileCount: pngFiles.length });
  } catch (error) {
    console.error("Error counting PNG files:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
