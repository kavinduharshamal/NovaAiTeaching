import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useFBX, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { FloorFBX } from "./FloorFBX";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Classroom } from "./Calssroom";

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
  const [maxFileIndex, setMaxFileIndex] = useState(0);
  const [audioStopped, setAudioStopped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const folderName = props.fileName;
  console.log(folderName);
  const initialTexture = "/texture/9875308.jpg";
  const fileMusic = "audio/hi_ranmi_213/1.mp3";
  const viewport = useThree((state) => state.viewport);

  const animationRef = useRef("Idle2");

  useEffect(() => {
    // Fetch the maxFileIndex from the API
    const fetchMaxFileIndex = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/countAudioFiles?fileName=${folderName}`
        );
        const data = await response.json();
        setMaxFileIndex(data.audioFileCount);
      } catch (error) {
        console.error("Error fetching maxFileIndex:", error);
      }
    };

    fetchMaxFileIndex();
  }, []);

  const audio = useMemo(() => {
    const audioElement = new Audio(
      `/audio/${folderName}/${currentFileIndex}.mp3`
    );
    audioElement.onerror = () => {
      console.error(`Error loading audio: ${currentFileIndex}.mp3`);
      return fileMusic;
    };
    return audioElement;
  }, [currentFileIndex]);

  // Load texture dynamically based on whether play has been pressed
  const textureMap = useTexture(
    isPlaying ? `/audio/${folderName}/${currentFileIndex}.png` : initialTexture
  );

  useEffect(() => {
    const loader = new THREE.FileLoader();
    loader.load(
      `/audio/${folderName}/${currentFileIndex}.json`,
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
        console.error(
          `Error loading JSON file: No file found for ${currentFileIndex}.json`
        );
        // Fallback: Return to idle animation on error
        fadeToAnimation("Talking", "Idle2", 0.5);
        animationRef.current = "Idle2";
      }
    );
  }, [currentFileIndex]);

  const { nodes, materials } = useGLTF("models/6565ab44e0834c9ab37a141c.glb");
  const { animations: idleAnimation } = useFBX("/animation/Idle.fbx");
  const { animations: talkingAnimation1 } = useFBX("/animation/Walking.fbx");
  const { animations: talkingAnimation2 } = useFBX("/animation/Waving.fbx");
  const { animations: talkingAnimation } = useFBX("/animation/Talking2.fbx");

  // Assign animation names
  idleAnimation[0].name = "Idle2";
  talkingAnimation1[0].name = "Talking1";
  talkingAnimation2[0].name = "Talking2";
  talkingAnimation[0].name = "Talking";

  const characterGroup = useRef();
  const meshGroup = useRef();

  // Attach animations to characterGroup using `useAnimations`
  const { actions } = useAnimations(
    [
      idleAnimation[0],
      //talkingAnimation1[0],
      talkingAnimation2[0],
      talkingAnimation[0],
    ],
    characterGroup
  );

  const fadeToAnimation = (from, to, duration = 0.4) => {
    if (actions[from]) actions[from].fadeOut(duration);
    if (actions[to]) {
      console.log(`Changing animation from ${from} to ${to}`);
      actions[to].reset().fadeIn(duration).play();
    }
  };

  // Smooth animation for the character using react-spring
  const characterSpring = useSpring({
    position: isPlaying ? [2, -1.5, 4] : [0, -1.5, 6], // Adjusted character position when playing
    rotation: isPlaying ? [-Math.PI / 2, 0, -0.6] : [-Math.PI / 2, 0, 0], // Adjusted rotation for the character
    config: { duration: 1000 },
  });

  // Smooth animation for the mesh (background texture plane)
  const meshSpring = useSpring({
    position: isPlaying ? [0, -3, 4] : [0, -3, 5], // Adjusted mesh position
    rotation: isPlaying ? [-Math.PI / 2, 0, Math.PI / 6] : [-Math.PI / 2, 0, 0], // Adjusted rotation for the mesh
    config: { duration: 1000 },
  });

  useEffect(() => {
    if (playAudio && !audioStopped) {
      setIsPlaying(true);
      fadeToAnimation("Idle2", "Talking1", 0.3);
      animationRef.current = "Talking1";
      audio.play();
      audio.onended = () => {
        if (currentFileIndex < maxFileIndex) {
          setCurrentFileIndex((prev) => prev + 1);
        } else {
          console.log("Reached the last file.");
          fadeToAnimation(animationRef.current, "Idle2", 0.5);
          animationRef.current = "Idle2";
          audio.pause();
          audio.currentTime = 0;
          setAudioStopped(true);

          // Add this line to show "All are done" in the console when all audio is complete
          console.log("All are done");
          window.location.href = "/gpt";
        }
      };
    } else if (audioStopped) {
      fadeToAnimation(animationRef.current, "Idle2", 0.3);
      animationRef.current = "Idle2";
    } else {
      setIsPlaying(false);
      fadeToAnimation(animationRef.current, "Idle2", 0.3);
      animationRef.current = "Idle2";
      audio.pause();
    }
  }, [playAudio, audio, currentFileIndex, maxFileIndex, audioStopped, actions]);

  useEffect(() => {
    // Play the initial idle animation when the component is mounted
    if (actions && actions["Idle2"]) {
      actions["Idle2"].reset().play();
    }

    // Animation sequence every 5 seconds
    const intervalId = setInterval(() => {
      if (isPlaying) {
        const nextAnimation =
          animationRef.current === "Talking1"
            ? "Talking2"
            : animationRef.current === "Talking2"
            ? "Talking"
            : "Talking1";

        fadeToAnimation(animationRef.current, nextAnimation, 0.4);
        animationRef.current = nextAnimation;
      }
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [actions, isPlaying]);

  useFrame(() => {
    if (characterGroup.current && playAudio && lipsync) {
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

  return (
    <>
      {/* Animated Mesh (Background Texture Plane) */}
      <animated.group
        {...props}
        dispose={null}
        ref={meshGroup}
        position={meshSpring.position} // Animated position for the mesh
        rotation={meshSpring.rotation} // Animated rotation for the mesh
        castShadow
        receiveShadow
      >
        <mesh
          position={[0, 0.4, 1.6]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <Classroom scale={0.5} position={[0, -0.82, 2]} />
          <mesh position={[0.1, 0.07, 0.01]} scale={0.98}>
            <boxGeometry args={[2.1, 1.4, 0.1]} position={[0, 0, 0]} />
            <meshBasicMaterial map={textureMap} />
          </mesh>
        </mesh>
      </animated.group>

      {/* Animated Character */}
      <animated.group
        ref={characterGroup}
        position={characterSpring.position} // Animated position for the character
        rotation={characterSpring.rotation} // Animated rotation for the character
      >
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
          castShadow
          receiveShadow
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
          material={materials.Wolf3D_Outfit_Bottom}
          skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
          castShadow
          receiveShadow
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
          material={materials.Wolf3D_Outfit_Footwear}
          skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
          castShadow
          receiveShadow
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Top.geometry}
          material={materials.Wolf3D_Outfit_Top}
          skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
          castShadow
          receiveShadow
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair}
          skeleton={nodes.Wolf3D_Hair.skeleton}
          castShadow
          receiveShadow
        />
        <primitive object={nodes.Hips} />
      </animated.group>
      <mesh
        receiveShadow
        position={[0, -1.5, 5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2000, 2000]} />
        {/* <FloorFBX
          rotation={[-Math.PI / 2, Math.PI / 2, Math.PI]}
          scale={2}
        ></FloorFBX> */}
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
}

useGLTF.preload("models/6565ab44e0834c9ab37a141c.glb");
