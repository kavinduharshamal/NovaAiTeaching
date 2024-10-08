import React, { useState } from "react";
import {
  Fab,
  Popover,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";

const ReminderButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // New state for date
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAdd = async () => {
    const reminder = {
      teacherId: Cookies.get("teacherId"),
      eventName: topic,
      description: description,
      dateAndTime: `${date}T08:00:00`, // Using selected date with hardcoded time
    };

    try {
      const response = await fetch(
        "https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Reminder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reminder),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Failed to add reminder:", response.status, errorMessage);
        setSnackbarMessage("Failed to add reminder.");
        setOpenSnackbar(true);
        return;
      }

      console.log("Reminder added successfully");
      setSnackbarMessage("Reminder added successfully!");
      setOpenSnackbar(true);
      setTopic(""); // Reset topic input
      setDescription(""); // Reset description input
      setDate(""); // Reset date input
      handleClose(); // Close the popover
      window.location.reload();
    } catch (error) {
      console.error("Error adding reminder:", error);
      setSnackbarMessage("Error adding reminder.");
      setOpenSnackbar(true);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Fab
        sx={{
          bottom: 5,
          right: 0,
          backgroundColor: "#148B9E",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0F4F60",
          },
        }}
        size="small"
        aria-label="add"
        onClick={handleClick}
      >
        <AddIcon />
      </Fab>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            width: "350px", // Custom width
            height: "425px", // Custom height
            mt: "-16px", // Small margin to ensure it's above the button
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#0F4F60", color: "white" }}>
          Add Reminder
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Topic"
            type="text"
            fullWidth
            variant="outlined"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date" // Change the type to date
            fullWidth
            variant="outlined"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true, // Ensures the label stays above the input
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{ backgroundColor: "#0F4F60", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            sx={{ backgroundColor: "#0F4F60", color: "white" }}
          >
            Add
          </Button>
        </DialogActions>
      </Popover>

      {/* Snackbar for feedback messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReminderButton;
