import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useFBX, useGLTF, useTexture } from "@react-three/drei"; // useTexture hook for texture loading
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath"; // Use easing library to smooth animations

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

export function Avtera(props) {
  const { playAudio } = props;
  const [currentFileIndex, setCurrentFileIndex] = useState(1);
  const [lipsync, setLipsync] = useState(null);
  const viewport = useThree((state) => state.viewport);

  const audio = useMemo(
    () => new Audio(`/audio/LectureOne/${currentFileIndex}.mp3`),
    [currentFileIndex]
  );

  // Load texture dynamically based on current audio index (1.png, 2.png, etc.)
  const textureMap = useTexture(`/audio/LectureOne/${currentFileIndex}.png`);

  useEffect(() => {
    const loader = new THREE.FileLoader();
    loader.load(
      `/audio/LectureOne/${currentFileIndex}.json`,
      (data) => {
        try {
          const parsedData = JSON.parse(data);
          setLipsync(parsedData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      },
      undefined,
      (error) => {
        console.error("Error loading JSON file:", error);
      }
    );
  }, [currentFileIndex]);

  const { nodes, materials } = useGLTF("models/6565ab44e0834c9ab37a141c.glb");
  const { animations: idleAnimation } = useFBX("/animation/Idle.fbx");
  const { animations: talkingAnimation1 } = useFBX("/animation/Walking.fbx");
  const { animations: talkingAnimation2 } = useFBX("/animation/Waving.fbx");

  idleAnimation[0].name = "Idle2";
  talkingAnimation1[0].name = "Talking1";
  talkingAnimation2[0].name = "Talking2";

  const [animation, setAnimation] = useState("Idle2");
  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], talkingAnimation1[0], talkingAnimation2[0]],
    group
  );

  const fadeToAnimation = (from, to, duration = 0.4) => {
    if (actions[from]) actions[from].fadeOut(duration);
    if (actions[to]) actions[to].fadeIn(duration).reset().play();
  };

  useEffect(() => {
    let animationInterval;
    if (playAudio) {
      fadeToAnimation("Idle2", "Talking1", 0.3);
      setAnimation("Talking1");
    } else {
      fadeToAnimation("Talking1", "Idle2", 0.3);
      setAnimation("Idle2");
    }

    return () => {
      clearInterval(animationInterval);
    };
  }, [playAudio, actions]);

  useFrame(() => {
    if (group.current && playAudio && lipsync) {
      const currentAudioTime = audio.currentTime;
      Object.values(corresponding).forEach((value) => {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = 0;
      });

      lipsync.mouthCues.forEach((mouthCue) => {
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
        }
      });
    }
  });

  useEffect(() => {
    if (playAudio) {
      audio.play();
      audio.onended = () => {
        fadeToAnimation("Talking1", "Idle2", 0.5);
        setCurrentFileIndex((prev) => prev + 1);
      };
    } else {
      audio.pause();
      setAnimation("Idle2");
    }
  }, [playAudio, audio]);

  return (
    <group {...props} dispose={null} ref={group}>
      {/* Background Plane */}

      {/* Character */}
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
      {/* Display the texture as the background plane */}
      <mesh position={[0, 0.4, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[viewport.width / 4.2, viewport.height / 4.2]} />
        <meshBasicMaterial map={textureMap} />
      </mesh>
    </group>
  );
}

useGLTF.preload("models/6565ab44e0834c9ab37a141c.glb");
