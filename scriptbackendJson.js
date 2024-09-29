import { exec } from "child_process";
import cors from "cors";
import express from "express";
import path from "path";
import { promises as fsPromises } from "fs"; // Async file operations

const app = express();
app.use(express.json());
app.use(cors());
const port = 3001;

// Helper to execute Rhubarb for generating JSON
const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
      } else {
        console.log(`Command executed successfully: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

// POST route to generate JSON from WAV file
app.post("/generateJson", async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).send({ error: "WAV file path is required" });
  }

  try {
    const wavFilePath = `"${filePath}"`;
    const jsonFilePath = `"${filePath.replace(".wav", ".json")}"`;

    console.log(`Generating JSON from WAV: ${wavFilePath}`);

    // Execute Rhubarb to generate the JSON file
    await execCommand(
      `./Rhubarb-Lip/rhubarb -f json ${wavFilePath} -o ${jsonFilePath}`
    );

    console.log(`JSON generated for: ${jsonFilePath}`);
    res.status(200).send({ message: `JSON generated for: ${jsonFilePath}` });
  } catch (error) {
    console.error(`Error generating JSON for: ${filePath}`);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Backend 2 listening on port ${port}`);
});
