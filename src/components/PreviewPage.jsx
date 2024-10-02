import React, { Suspense, useState, useEffect } from "react";
import { Experience } from "./Experience";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import Cookies from "js-cookie";
import ProfileBar from "./ProfileBar";
import LogoBar from "./LogoBar";
import MenuBar from "./MenuBar";

export const PreviewPage = ({ themeMode }) => {
  const [playAudio, setPlayAudio] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const fileName = Cookies.get("fileName") || "";
  const teacherId = Cookies.get("teacherId");
  const theme = useTheme();
  const topicName = Cookies.get("topicName");
  console.log(topicName);

  // Toggle play/pause state
  const togglePlay = () => {
    setPlayAudio((prev) => !prev);
  };

  // Fetch mp3 and png files
  useEffect(() => {
    const fetchFiles = async () => {
      if (fileName) {
        try {
          const response = await fetch(
            `http://localhost:3000/countAudioFiles?fileName=${fileName}`
          );
          const data = await response.json();
          console.log(data.audioFileCount);

          if (data.audioFileCount && typeof data.audioFileCount === "number") {
            const filesArray = Array.from(
              { length: data.audioFileCount },
              (_, i) => i + 1
            );
            setAudioFiles(filesArray);
          } else {
            setAudioFiles([]); // If no files found, set to an empty array
          }
        } catch (error) {
          console.error("Error fetching files:", error);
          setAudioFiles([]); // Set to an empty array in case of error
        }
      }
    };

    fetchFiles();
  }, [fileName]);

  // Dynamic styles
  const wavePatternStyle = {
    position: "absolute",
    right: "-20px",
    width: "60px",
    height: "60px",
    background: `conic-gradient(${theme.palette.primary.main}, transparent)`,
    opacity: 0.3,
    transform: "rotate(45deg)",
    borderRadius: "50%",
  };

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Top Navigation Section */}
      <div
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[4],
        }}
      >
        <ProfileBar
          teacherId={teacherId || 1}
          type="teacher"
          themeMode={themeMode}
        />
        <LogoBar themeMode={themeMode} />
        <MenuBar />
      </div>

      {/* Main Content Area */}
      <div style={containerStyle}>
        {/* Left Section: 60% of the screen for the Experience Canvas */}
        <div style={canvasContainerStyle}>
          <div style={centeredBoxStyle}>
            <Canvas shadows camera={{ position: [0, 0, 9.5], fov: 40 }}>
              <Suspense fallback={null}>
                <Experience playAudio={playAudio} />
              </Suspense>
            </Canvas>
            <Loader />
          </div>
        </div>

        {/* Right Section: 40% of the screen for data */}
        <div
          style={{
            ...dataContainerStyle,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "20px" }}>
            Media Of the {topicName} Lecture
          </Typography>

          {/* Play/Pause Button */}
          <Button
            variant="contained"
            color={playAudio ? "secondary" : "primary"}
            onClick={togglePlay}
            style={{ marginBottom: "20px" }}
          >
            {playAudio ? "Pause" : "Play"}
          </Button>

          {/* Display Audio Files and their corresponding images */}
          {audioFiles.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No audio files found for folder: {fileName}
            </Typography>
          ) : (
            <div style={fileGridStyle}>
              {audioFiles.map((fileIndex) => (
                <Card
                  key={fileIndex}
                  style={{
                    ...cardStyle,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    boxShadow: theme.shadows[2],
                    transition: "transform 0.3s ease-in-out",
                  }}
                  className="card-hover"
                >
                  <div style={mediaContainerStyle}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`/audio/${fileName}/${fileIndex}.png`}
                      alt={`Image for file ${fileIndex}`}
                      style={{
                        objectFit: "contain",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </div>
                  <CardContent>
                    <Typography
                      variant="h6"
                      style={{
                        color: theme.palette.text.primary,
                        textAlign: "center",
                      }}
                    >
                      Conent {fileIndex} Audio and Media
                    </Typography>

                    {/* Wrapper for Audio Player */}
                    <div style={audioPlayerContainerStyle}>
                      <audio
                        controls
                        src={`/audio/${fileName}/${fileIndex}.mp3`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles for the container and child elements
const containerStyle = {
  display: "flex",
  flexDirection: "row",
  height: "calc(100vh - 100px)",
  width: "100%",
  padding: "20px",
  gap: "20px",
};

const canvasContainerStyle = {
  flex: "6", // 60% of the screen
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const centeredBoxStyle = {
  width: "100%", // Set width to 70% of its parent container
  aspectRatio: "16 / 9", // Set the aspect ratio to 16:9
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const dataContainerStyle = {
  flex: "4", // 40% of the screen
  height: "100%",
  padding: "20px",
  overflowY: "auto",
};

const fileGridStyle = {
  display: "flex",
  flexWrap: "wrap", // Allow wrapping of items to maintain responsiveness
  justifyContent: "center", // Center items horizontally
  alignItems: "center", // Center items vertically
  gap: "20px", // Space between items
};

const cardStyle = {
  maxWidth: 500,
  padding: "16px",
  borderRadius: "8px",
  transition: "transform 0.3s ease",
};

const mediaContainerStyle = {
  display: "flex",
  justifyContent: "center", // Center horizontally
  alignItems: "center", // Center vertically
  height: "380px", // Keep the height consistent with the CardMedia height
  width: "100%", // Ensure it takes full width of the card
};

const audioPlayerContainerStyle = {
  display: "flex",
  justifyContent: "center", // Center the audio player horizontally
  alignItems: "center", // Center the audio player vertically
  padding: "10px", // Add padding around the audio player
  position: "relative",
};

// CSS for hover effect
const styles = `
  .card-hover:hover {
    transform: scale(1.05);
  }
`;

// Adding CSS dynamically to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
