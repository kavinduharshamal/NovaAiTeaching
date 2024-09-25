import { Avtera } from "../components/Avtera";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";
import { Loader } from "../components/Loader";
function Prices() {
  return (
    <Suspense fallback={<Loader />}>
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />

        <Experience />
      </Canvas>
    </Suspense>
  );
}
export default Prices;
