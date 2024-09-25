import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

const currentPath = window.location.pathname;
const segments = currentPath.split("/");
const currentSegment = segments[segments.length - 1];
const script = currentSegment;

export function Avtera(props) {
  const { playAudio } = props;

  const audio = useMemo(() => new Audio(`/audio/${script}.mp3`), [script]);
  console.log(audio);
  const jsonFile = useLoader(THREE.FileLoader, `/audio/${script}.json`);
  const lipsync = JSON.parse(jsonFile);

  const { nodes, materials } = useGLTF("models/6565ab44e0834c9ab37a141c.glb");
  const { animations: idleAnimation } = useFBX("/animation/Idle.fbx");
  const { animations: talkingAnimation1 } = useFBX("/animation/Walking.fbx");
  const { animations: talkingAnimation2 } = useFBX("/animation/Waving.fbx");

  // Set animation names
  idleAnimation[0].name = "Idle2";
  talkingAnimation1[0].name = "Talking1";
  talkingAnimation2[0].name = "Talking2";

  const [animation, setAnimation] = useState("Idle2");
  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], talkingAnimation1[0], talkingAnimation2[0]],
    group
  );

  // Timer for switching between talking animations
  useEffect(() => {
    let switchInterval;

    if (playAudio) {
      // Start alternating talking animations every 3 seconds
      switchInterval = setInterval(() => {
        setAnimation((prev) => (prev === "Talking1" ? "Talking2" : "Talking1"));
      }, 3000); // Switch every 3 seconds
    }

    return () => {
      clearInterval(switchInterval); // Clear the interval when animation stops
    };
  }, [playAudio]);

  // Ensure the model always faces the camera
  useEffect(() => {
    if (group.current) {
      // group.current.rotation.set(0, Math.PI / 2, 0); // Face camera if needed
    }
  }, []);

  // Morph target for lipsync
  useFrame(() => {
    if (group.current && playAudio) {
      const currentAudioTime = audio.currentTime;
      Object.values(corresponding).forEach((value) => {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = 0;
      });

      // Update mouth cues during audio
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (
          currentAudioTime >= mouthCue.start &&
          currentAudioTime <= mouthCue.end
        ) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
              corresponding[mouthCue.value]
            ]
          ] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
              corresponding[mouthCue.value]
            ]
          ] = 1;
          break;
        }
      }
    }
  });

  // Control animations based on audio play
  useEffect(() => {
    if (playAudio) {
      audio.play();
      setAnimation("Talking1");
      audio.onended = () => {
        setAnimation("Idle2");
      };
    } else {
      audio.pause();
      setAnimation("Idle2");
    }
  }, [playAudio]);

  // Ensure the correct animation is playing
  useEffect(() => {
    if (actions[animation]) {
      actions[animation].play();
    }
    return () => {
      if (actions[animation]) actions[animation].stop(); // Stop the animation when unmounted
    };
  }, [animation, actions]);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
    </group>
  );
}

useGLTF.preload("models/6565ab44e0834c9ab37a141c.glb");
