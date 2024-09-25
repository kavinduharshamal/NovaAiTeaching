import React, { useRef, useState } from "react";
import {
  ContactShadows,
  Environment,
  Text,
  Text3D,
  useTexture,
} from "@react-three/drei";
import { FirstPage } from "./FirstPage";
import { useFrame, useThree } from "@react-three/fiber";
import { Background } from "./Background";
import { BrainyNova } from "./BrainyNova";
import { Button } from "./Button";
import { Year } from "./year";
import WhiteLogo from "./WhiteLogo";

function InteractiveBox({ onClick }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  // Animation logic using react-three-fiber's useFrame
  useFrame(() => {
    if (hovered) {
      meshRef.current.scale.x += (0.5 - meshRef.current.scale.x) * 0.1;
      meshRef.current.scale.y += (0.5 - meshRef.current.scale.y) * 0.1;
      meshRef.current.scale.z += (0.5 - meshRef.current.scale.z) * 0.1;
    } else {
      meshRef.current.scale.x += (0.3 - meshRef.current.scale.x) * 0.1;
      meshRef.current.scale.y += (0.3 - meshRef.current.scale.y) * 0.1;
      meshRef.current.scale.z += (0.3 - meshRef.current.scale.z) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[1, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxBufferGeometry args={[6, 1.5, 1]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />

      {/* Inside the transparent box, add the Button component */}
      <Button onClick={onClick} />
    </mesh>
  );
}
export const ExperienceHome = () => {
  const viewport = useThree((state) => state.viewport);

  const handleClick = () => {
    window.location.href = "/login";
  };
  return (
    <>
      <Background />
      <Environment preset="sunset" />

      <group position={[0, -1, 0]}>
        <ContactShadows
          opacity={0.42}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        {/* Avatar mesh */}
        <mesh rotation-x={-Math.PI / 16}>
          <FirstPage />
        </mesh>
        <mesh
          rotation={[0, Math.PI / 3, 0]}
          position={[-1.4, -0.4, 0]}
          rotation-x={-Math.PI / 16}
        >
          <FirstPage castShadow scale={1.5} />
        </mesh>
        <mesh position={[0, 0, 1]} />
        <mesh position={[0.8, 1.7, 0]}>
          <BrainyNova scale={0.8} />
        </mesh>
        <mesh scale={0.5} position={[0.7, 0, 0]}></mesh>
        <InteractiveBox onClick={handleClick} />

        <Year
          position={[-2.7, 1.5, 0]}
          rotation={[Math.PI / 2.5, 0, 0]}
          scale={0.15}
          opacity={0.6}
        />
        <WhiteLogo />
      </group>
    </>
  );
};
