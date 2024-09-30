import React from "react";

const LogoBar = ({ themeMode }) => {
  const styles = {
    navbar: {
      backgroundColor: themeMode === "dark" ? "#0F4F60" : "#F5F5F5",
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
          themeMode === "dark"
            ? "/texture/whiteLogo.png"
            : "/texture/logoBlack.png"
        }
        alt="Logo"
        style={styles.logo}
      />
      <img
        src={
          themeMode === "dark"
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
