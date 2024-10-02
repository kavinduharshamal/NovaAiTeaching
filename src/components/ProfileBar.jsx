import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

const ProfileBar = ({ teacherId, type }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Use Material UI theme

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
      backgroundColor: theme.palette.background.paper,
      height: "40px",
      display: "flex",
      alignItems: "center",
      padding: "0 1rem",
      boxShadow: `0px 4px 10px ${
        theme.palette.mode === "dark"
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(200, 200, 200, 0.8)"
      }`,
    },
    title: {
      flexGrow: 1,
      textAlign: "right",
      padding: "10px",
      fontSize: "18px",
      color: theme.palette.text.primary,
    },
    avatar: {
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      margin: "5px",
      border: `2px solid ${theme.palette.text.primary}`,
    },
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.title}>{user?.firstName || "Guest"}</div>
      <img
        alt="User Avatar"
        src={user?.pictureUrl || "https://via.placeholder.com/40"}
        style={styles.avatar}
      />
    </div>
  );
};

export default ProfileBar;
