import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Padding } from "@mui/icons-material";
import Cookies from "js-cookie";

const ReactionBoard = ({ teacherId }) => {
  const [selectedReaction, setSelectedReaction] = useState(null);
  const theme = useTheme(); // Access the current theme to apply colors dynamically

  const emojis = [
    { id: 1, emoji: "😡", label: "Angry" },
    { id: 2, emoji: "😞", label: "Sad" },
    { id: 3, emoji: "😊", label: "Satisfied" },
    { id: 4, emoji: "😁", label: "Happy" },
    { id: 5, emoji: "😍", label: "Loved" },
  ];

  useEffect(() => {
    // Load the saved reaction from the cookie if it exists
    const savedReaction = Cookies.get(`reaction_${teacherId}`);
    if (savedReaction) {
      setSelectedReaction(parseInt(savedReaction));
    }
  }, [teacherId]);

  const handleReactionClick = (id) => {
    setSelectedReaction(id);
    Cookies.set(`reaction_${teacherId}`, id, { expires: 7 });
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default, // Use paper color from theme
        paddingTop: 2, // Add padding to make it look nicer
        borderRadius: 22, // Slightly round the corners for a polished look
        boxShadow: 3, // Add a shadow to make it stand out
        textAlign: "center",
        mt: 4,
      }}
    >
      <Typography variant="h8" color={theme.palette.text.primary}>
        How was your experience today?
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "15px",
        }}
      >
        {emojis.map((emoji) => (
          <IconButton
            key={emoji.id}
            onClick={() => handleReactionClick(emoji.id)}
            sx={{
              transition: "transform 0.3s ease",
              opacity: 1,
              color: "inherit",
              "&:hover": {
                transform: "scale(1)",
              },
              ...(selectedReaction === emoji.id && {
                transform: "scale(1.5) !important",
              }),
            }}
          >
            <span role="img" aria-label={emoji.label}>
              {emoji.emoji}
            </span>
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default ReactionBoard;
