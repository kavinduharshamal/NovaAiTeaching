import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { useChat } from "../hooks/useChat";
import { AvatarOfGpt } from "./AvatarOfGpt";
import * as THREE from "three";
import { LayerMaterial, Color, Depth, Noise } from "lamina";
import { useFrame } from "@react-three/fiber";

const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

export const ExperienceGpt = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();
  const environmentRef = useRef();
  useEffect(() => {
    cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);
  useFrame(() => {
    if (environmentRef.current) {
      environmentRef.current.rotation.y += 0.001; // Adjust the speed of rotation here
    }
  });
  useEffect(() => {
    if (cameraZoomed) {
      cameraControls.current.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
    } else {
      cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
    }
  }, [cameraZoomed]);
  return (
    <>
      <CameraControls ref={cameraControls} />
      <directionalLight
        position={[1, 1, 1]}
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
      <Environment background resolution={64}>
        <mesh ref={environmentRef} scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <LayerMaterial side={THREE.BackSide}>
            {/* Set background color as provided in the code */}
            <Color color="pink" alpha={1} mode="normal" />
            <Depth
              colorA="#E4B1F0" // Gradient start color
              colorB="pink" // Gradient end color
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
      {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>
      <AvatarOfGpt />
      <ContactShadows opacity={0.7} />
    </>
  );
};
