import React from "react";
import { Box, CircularProgress } from "@mui/material";

const FullScreenLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
        zIndex: 9999, // High z-index to cover the whole page
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default FullScreenLoader;
