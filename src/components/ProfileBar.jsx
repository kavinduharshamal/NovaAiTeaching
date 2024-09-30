import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileBar = ({ teacherId, type, themeMode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/${type}/${teacherId}`
        );
        setUser(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchUser();
    }
  }, [teacherId, type]);

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const styles = {
    navbar: {
      backgroundColor: themeMode === "dark" ? "#1A202C" : "#FFFFFF", // Darker background for dark mode, light for light mode
      height: "40px",
      display: "flex",
      alignItems: "center",
      padding: "0 1rem",
      boxShadow:
        themeMode === "dark"
          ? "0px 4px 10px rgba(0, 0, 0, 0.8)"
          : "0px 4px 10px rgba(200, 200, 200, 0.8)",
    },
    title: {
      flexGrow: 1,
      textAlign: "right",
      padding: "10px",
      fontSize: "18px",
      color: themeMode === "dark" ? "#E2E8F0" : "#2D3748", // Light text color for dark mode, dark text for light mode
    },
    avatar: {
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      margin: "5px",
      border: themeMode === "dark" ? "2px solid #E2E8F0" : "2px solid #2D3748", // Different border color for each theme
    },
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.title}>{user?.firstName || "Guest"}</div>
      <img
        alt="User Avatar"
        src="https://via.placeholder.com/40"
        style={styles.avatar}
      />
    </div>
  );
};

export default ProfileBar;
