import React, { useState } from "react";
import Draggable from "react-draggable";
import { Paper, Typography, Button, Box, useTheme } from "@mui/material";
import shadows from "@mui/material/styles/shadows";

function QandA({ themeMode }) {
  const [showPopup, setShowPopup] = useState(false);
  const theme = useTheme();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      {/* Draggable Container with Button and Popup */}
      <Draggable bounds="parent">
        <Box
          sx={{
            position: "fixed", // Make the button fixed on the screen
            bottom: 16, // 16px from the bottom
            right: 16, // 16px from the right
            zIndex: 1100,
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          {/* Toggle Button */}
          <Button
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.main
                  : theme.palette.common.white,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.text.primary
                  : theme.palette.common.black,
              width: 60,
              height: 60,
              borderRadius: "50%",
              boxShadow: 3,
              "&:hover": {
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Larger shadow when hovered
              },
            }}
            onClick={togglePopup}
          >
            Q&A
          </Button>

          {/* Popup Panel (shown/hidden based on state) */}
          {showPopup && (
            <Paper
              sx={{
                mt: 2,
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: 300,
                position: "relative",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              {/* FAQ Content */}
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                FAQs
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                How to Add Module?
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: theme.palette.text.primary }}
              >
                Click the Add Module Button and then fill the required fields.
                Then save. Your new module is recorded.
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                How to Add Reminder?
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: theme.palette.text.primary }}
              >
                Click the + Button in Reminder Calendar and fill the required
                fields. Then a new reminder will be added.
              </Typography>

              {/* Close Button */}
              <Button
                variant="contained"
                onClick={togglePopup}
                sx={{
                  mt: 1,
                  fontSize: 13,
                  fontWeight: "bold",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.main
                      : theme.palette.common.white,
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : theme.palette.common.black,
                  borderRadius: "20px",
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Close
              </Button>
            </Paper>
          )}
        </Box>
      </Draggable>
    </>
  );
}

export default QandA;
