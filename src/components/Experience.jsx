import {
  Cloud,
  Environment,
  Html,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { Avtera } from "./Avtera";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

const buttonStyle = {
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

const hoverStyles = {
  transform: "scale(1.2)",
};
export const Experience = (props) => {
  console.log("hiss");
  console.log(props.texture);
  const texrureMap = useTexture(props.texture);
  const viewport = useThree((state) => state.viewport);
  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={true}
        enableRotate={false}
        zoomSpeed={0.5} // Adjust the zoom speed
        panSpeed={0.3} // Adjust the pan speed
        rotateSpeed={0.4}
      />
      <Avtera position={[0, -3, 5]} scale={2} rotation={[-Math.PI / 2, 0, 0]} />
      <Environment preset="sunset" />

      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texrureMap} />
      </mesh>
      <Html position={[viewport, viewport, 0]}>
        <a
          href="/aiteacher"
          style={{ ...buttonStyle }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          HOME
        </a>
      </Html>
    </>
  );
};
