import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useFBX, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three"; // Import from react-spring
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

export function Avtera(props) {
  const { playAudio } = props;
  const [currentFileIndex, setCurrentFileIndex] = useState(1);
  const [lipsync, setLipsync] = useState(null);
  const [maxFileIndex, setMaxFileIndex] = useState(0);
  const [audioStopped, setAudioStopped] = useState(false); // New state to track audio stopping
  const [isPlaying, setIsPlaying] = useState(false); // New state to track if play has been pressed
  const folderName = "hi_ranmi_213";
  const initialTexture = "audio/hi_ranmi_213/main.png"; // Main image before playing
  const fileMusic = "audio/hi_ranmi_213/1.mp3";
  const viewport = useThree((state) => state.viewport);

  useEffect(() => {
    // Fetch the maxFileIndex from the API
    const fetchMaxFileIndex = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/countAudioFiles?fileName=${folderName}`
        );
        const data = await response.json();
        setMaxFileIndex(data.audioFileCount - 1); // Subtract 1 to match zero-based index
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
    isPlaying ? `/audio/${folderName}/${currentFileIndex}.png` : initialTexture,
    undefined,
    (err) => {
      console.error(`Error loading image: ${currentFileIndex}.png`);
      // Provide a fallback texture
      return initialTexture;
    }
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
        fadeToAnimation("Talking1", "Idle2", 0.5);
        setAnimation("Idle2");
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

  // Smooth animation for position and rotation using react-spring
  const { position, rotation } = useSpring({
    position: isPlaying ? [0, -3, 2] : [0, -3, 5], // Change position when playing
    rotation: isPlaying ? [-Math.PI / 2, 0, Math.PI / 4] : [-Math.PI / 2, 0, 0], // Change rotation when playing
    config: { duration: 1000 }, // Smooth transition duration
  });

  const { positionOfCharacter, rotationOfCharacter } = useSpring({
    position: isPlaying ? [0, 3, 0] : [0, 5, 5], // Change position when playing
    rotation: isPlaying ? [0, 0, 0] : [0, 0, 0], // Change rotation when playing
    config: { duration: 1000 }, // Smooth transition duration
  });

  useEffect(() => {
    if (playAudio && !audioStopped) {
      setIsPlaying(true); // Mark that play has been pressed

      fadeToAnimation("Idle2", "Talking1", 0.3);
      setAnimation("Talking1");

      audio.play();
      audio.onended = () => {
        // Check if we reached the last file, prevent further increments
        if (currentFileIndex <= maxFileIndex) {
          setCurrentFileIndex((prev) => prev + 1);
        } else {
          console.log("Reached the last file.");
          setAnimation("Idle2"); // Set idle animation
          fadeToAnimation("Talking1", "Idle2", 0.5); // Smooth transition to idle animation

          // Stop playback after the last audio file ends
          audio.pause(); // Ensure audio stops after reaching the last file
          audio.currentTime = 0; // Reset the audio time for the last file

          setAudioStopped(true); // Prevent further playback
        }
      };
    } else if (audioStopped) {
      // If audio stopped, make sure we stay in idle animation
      setAnimation("Idle2");
      fadeToAnimation("Talking1", "Idle2", 0.3);
    } else {
      setIsPlaying(false); // Reset to initial state if audio is paused
      audio.pause();
      setAnimation("Idle2");
      fadeToAnimation("Talking1", "Idle2", 0.3);
    }
  }, [playAudio, audio, currentFileIndex, maxFileIndex, audioStopped, actions]);

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

  return (
    <>
      <animated.group
        {...props}
        dispose={null}
        ref={group}
        position={position} // Animated position
        rotation={rotation} // Animated rotation
      >
        <mesh position={[0, 0.4, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[viewport.width / 4.2, viewport.height / 4.2]} />
          <meshBasicMaterial map={textureMap} />
        </mesh>

        {/* Character */}
        <animated.group
          ref={group}
          position={positionOfCharacter}
          rotation={rotationOfCharacter}
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

          <primitive object={nodes.Hips} />
          <primitive object={nodes.Hips} />
        </animated.group>

        {/* Additional 3D character setup */}
        {/* Display the texture as the background plane */}
      </animated.group>
    </>
  );
}

useGLTF.preload("models/6565ab44e0834c9ab37a141c.glb");
