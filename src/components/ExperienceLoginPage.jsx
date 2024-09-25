import React, { useRef } from "react";

import { Environment, OrbitControls, Sky } from "@react-three/drei";
import { AvatarLogin } from "./AvatarLogin";
import { Desk } from "./Desk";
import { Background } from "./Background";
import { useFrame } from "@react-three/fiber";

export const ExperienceLoginPage = () => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    // Update rotation of the group
    if (groupRef.current) {
      groupRef.current.rotation.y += ((2 * Math.PI) / 60) * delta; // Adjust speed here
    }
  });

  return (
    <>
      <Sky />
      <Background />
      <Environment preset="sunset" />
      <group
        ref={groupRef}
        position={[1, -0.7, 0]}
        rotation={[0, -Math.PI / 8, 0]}
      >
        <AvatarLogin rotation-y={-Math.PI / 5} castShadow />
        <Desk scale={0.7} position={[-0.4, 0, 0.3]} rotation-y={-Math.PI / 5} />
      </group>
    </>
  );
};
