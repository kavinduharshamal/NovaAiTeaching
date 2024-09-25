import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function BrainyNova(props) {
  const { nodes, materials } = useGLTF("models/Brainy.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text.geometry}
        material={materials["Material.002"]}
        position={[-0.967, 0.025, 0.007]}
        rotation={[1.591, 0, 0.001]}
        scale={[1, 1, 1.015]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text001.geometry}
        material={nodes.Text001.material}
        position={[-0.705, -0.6, 0.004]}
        rotation={[1.582, 0, 0]}
        scale={[1, 1, 0.927]}
      />
    </group>
  );
}

useGLTF.preload("models/Brainy.glb");
