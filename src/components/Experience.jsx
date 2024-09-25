import React, { useState } from "react";
import { Button } from "@mui/material"; // Import Material-UI Button
import {
  Cloud,
  Environment,
  Html,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { Avtera } from "./Avtera";
import { useThree } from "@react-three/fiber";

const buttonStyleHome = {
  position: "absolute",
  margin: "15px",
  width: "70px",
  height: "70px",
  padding: "10px",
  borderRadius: "50%",
  backgroundColor: "pink",
  color: "white",
  textDecoration: "none",
  transition: "transform 0.2s",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)", // Add shadow effect
};
const buttonStyleplayButton = {
  position: "absolute",
  left: "-30%", // Center horizontally
  top: "40%",
  transform: "translateX(-50%)", // Adjust to center button horizontally
  width: "70px",
  height: "70px",
  padding: "10px",
  borderRadius: "50%",
  backgroundColor: "pink",
  color: "white",
  textDecoration: "none",
  transition: "transform 0.2s",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)", // Add shadow effect
};

export const Experience = (props) => {
  const [playAudio, setPlayAudio] = useState(false); // Add state for controlling play/pause
  const textureMap = useTexture(props.texture); // Load texture from props
  const viewport = useThree((state) => state.viewport);

  const togglePlay = () => {
    setPlayAudio((prev) => !prev);
  };

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        zoomSpeed={0.5} // Adjust the zoom speed
        panSpeed={0.3} // Adjust the pan speed
        rotateSpeed={0.4}
      />
      {/* Pass textureMap as prop to Avtera */}
      <Avtera
        position={[0, -3, 5]}
        scale={2}
        rotation={[-Math.PI / 2, 0, 0]}
        playAudio={playAudio} // Pass playAudio state to Avtera
        textureMap={textureMap} // Pass textureMap to Avtera
      />
      <Environment preset="sunset" />

      {/* <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={textureMap} />
      </mesh> */}

      {/* Material-UI Home Button */}
      <Html position={[viewport, viewport, 0]}>
        <a
          href="/aiteacher"
          style={{ ...buttonStyleHome }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          HOME
        </a>
      </Html>

      {/* Play Button with pointer events enabled */}
      <Html position={[0, 0, 0]}>
        <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
          <Button
            variant="contained"
            color={playAudio ? "secondary" : "primary"} // Change color based on state
            style={buttonStyleplayButton}
            onClick={togglePlay} // Toggle play/pause on click
          >
            {playAudio ? "Pause" : "Play"} {/* Button label based on state */}
          </Button>
        </div>
      </Html>
    </>
  );
};
