import * as THREE from "three";
import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import {
  Environment,
  Html,
  OrbitControls,
  useTexture,
  Float,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { LayerMaterial, Color, Depth, Noise } from "lamina";
import { Avtera } from "./Avtera";

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
  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
};

const buttonStyleplayButton = {
  position: "absolute",
  left: "-30%",
  top: "40%",
  transform: "translateX(-50%)",
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
  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
};

export const Experience = (props) => {
  const [playAudio, setPlayAudio] = useState(false);
  const textureMap = useTexture(props.texture);
  const viewport = useThree((state) => state.viewport);

  // Reference to the environment mesh
  const environmentRef = useRef();

  // Use useFrame to rotate the environment
  useFrame(() => {
    if (environmentRef.current) {
      environmentRef.current.rotation.y += 0.001; // Adjust the speed of rotation here
    }
  });

  const togglePlay = () => {
    setPlayAudio((prev) => !prev);
  };

  return (
    <>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.5}
        panSpeed={0.3}
        rotateSpeed={0.4}
      />

      <Avtera
        position={[0, -3, 5]}
        scale={2}
        rotation={[-Math.PI / 2, 0, 0]}
        playAudio={playAudio}
        textureMap={textureMap}
      />

      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Environment setup with color layers */}
      <Environment background resolution={64}>
        <mesh ref={environmentRef} scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <LayerMaterial side={THREE.BackSide}>
            {/* Set background color as provided in the code */}
            <Color color="#7FC7D9" alpha={1} mode="normal" />
            <Depth
              colorA="#00ffff" // Gradient start color
              colorB="#ff8f00" // Gradient end color
              alpha={0.5}
              mode="normal"
              near={0}
              far={300}
              origin={[100, 100, 100]}
            />
            <Noise mapping="local" type="cell" scale={0.5} mode="softlight" />
          </LayerMaterial>
        </mesh>
      </Environment>

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
            color={playAudio ? "secondary" : "primary"}
            style={buttonStyleplayButton}
            onClick={togglePlay}
          >
            {playAudio ? "Pause" : "Play"}
          </Button>
        </div>
      </Html>
    </>
  );
};
