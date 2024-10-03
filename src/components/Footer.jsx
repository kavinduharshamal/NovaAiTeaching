import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer = ({ themeMode }) => {
  const theme = useTheme();
  const isDarkMode = themeMode === "dark";

  const footerStyles = {
    width: "100%",
    backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
    color: isDarkMode ? "#fff" : "#000",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 40px",
  };

  const logo = isDarkMode ? "/texture/whiteLogo.png" : "/texture/logoBlack.png";

  return (
    <Box sx={{ ...footerStyles }}>
      <Box sx={{ flexShrink: 0 }}>
        <img
          src={logo}
          alt="Nova Studios Logo"
          style={{
            width: 100,
          }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, textAlign: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          &copy; {new Date().getFullYear()} Nova Studios. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Contact us: novastudio@gmail.com | +94 75 2418933
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
