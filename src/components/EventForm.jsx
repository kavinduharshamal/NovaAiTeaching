import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDateTime, setEventDateTime] = useState(dayjs());

  const handleSave = () => {
    const eventDetails = {
      name: eventName,
      date: eventDateTime.format("YYYY-MM-DD HH:mm"),
    };
    console.log("Event saved:", eventDetails);
    // Add logic here to handle form submission, like sending data to a server
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "300px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <TextField
        label="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        fullWidth
        required
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Select Date & Time"
          value={eventDateTime}
          onChange={(newValue) => setEventDateTime(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default EventForm;
