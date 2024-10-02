import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
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
import Cookies from "js-cookie";

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
  const [fileName, setFileName] = useState(() => Cookies.get("fileName") || "");
  const [playAudio, setPlayAudio] = useState(false);
  const viewport = useThree((state) => state.viewport);

  useEffect(() => {
    if (props.playAudio) {
      setPlayAudio(true);
    } else {
      setPlayAudio(false);
    }
  }, [props.playAudio]);
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
        fileName={fileName}
      />

      <directionalLight
        position={[6, 1, 3]}
        intensity={0.5}
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
            <Color color="#FFF0D1" alpha={1} mode="normal" />
            <Depth
              colorA="#FFF0D1" // Gradient start color
              colorB="#3B3030" // Gradient end color
              alpha={1}
              mode="normal"
              near={0}
              far={400}
              origin={[100, 100, 100]}
            />
            <Noise mapping="local" type="cell" scale={0.5} mode="softlight" />
          </LayerMaterial>
        </mesh>
      </Environment>

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
