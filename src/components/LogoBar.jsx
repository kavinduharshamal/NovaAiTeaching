import React from "react";
import { useTheme } from "@mui/material/styles";

const LogoBar = () => {
  const theme = useTheme(); // Use Material UI theme

  const styles = {
    navbar: {
      backgroundColor: theme.palette.background.default,
      height: "90px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "0 1rem",
    },
    logo: {
      height: "90px",
      width: "auto",
      marginRight: "1rem",
    },
    secondLogo: {
      height: "130px",
      width: "auto",
    },
  };

  return (
    <nav style={styles.navbar}>
      <img
        src={
          theme.palette.mode === "dark"
            ? "/texture/whiteLogo.png"
            : "/texture/logoBlack.png"
        }
        alt="Logo"
        style={styles.logo}
      />
      <img
        src={
          theme.palette.mode === "dark"
            ? "/texture/Title.png"
            : "/texture/Title_black.png"
        }
        alt="Second Logo"
        style={styles.secondLogo}
      />
    </nav>
  );
};

export default LogoBar;
