import React from "react";
import { Html } from "@react-three/drei";

const Loader = () => {
  return (
    <Html>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Loading...</h1>
      </div>
    </Html>
  );
};

export default Loader;
