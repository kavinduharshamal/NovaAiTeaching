import React from "react";
import { useTexture } from "@react-three/drei"; // Replace "your-three-js-library" with the actual import path

const WhiteLogo = () => {
  const texture = useTexture("texture/whiteLogo.png");

  return (
    <mesh position={[-2.4, 2.3, 0]} scale={0.8}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

export default WhiteLogo;
