import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";

const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState("today");
  const theme = useTheme();

  useEffect(() => {
    if (!currentDate) return;

    // Fetching events data from the backend based on the current date
    fetch(
      `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/events/month/${currentDate.getFullYear()}/${
        currentDate.getMonth() + 1
      }`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Ensure the API response structure is as expected
        setUpcomingEvents(data.$values || []);
      })
      .catch((error) => {
        console.error("Error fetching upcoming events:", error);
      });
  }, [currentDate]);

  const handleTimePeriodChange = (event) => {
    const selectedPeriod = event.target.value;
    setTimePeriod(selectedPeriod);

    const now = new Date();
    let newDate;

    switch (selectedPeriod) {
      case "previous":
        newDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case "next":
        newDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case "today":
      default:
        newDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    setCurrentDate(newDate);
  };

  function formatEventDate(startDate, endDate) {
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };

    const start = new Date(startDate);
    const end = new Date(endDate);

    const formattedDate = start.toLocaleDateString("en-US", optionsDate);
    const formattedStartTime = start.toLocaleTimeString("en-US", optionsTime);
    const formattedEndTime = end.toLocaleTimeString("en-US", optionsTime);

    return `<strong>Time:</strong> ${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
  }

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: theme.palette.background.default,
        borderRadius: "5px",
        borderColor: "none",
      }}
    >
      <Box sx={{ marginBottom: "20px" }}>
        <Select
          value={timePeriod}
          onChange={handleTimePeriodChange}
          sx={{ marginRight: "10px" }}
        >
          <MenuItem value="today">This Month</MenuItem>
          <MenuItem value="previous">Previous Month</MenuItem>
          <MenuItem value="next">Next Month</MenuItem>
        </Select>
      </Box>

      <Typography
        variant="h4"
        color={
          theme.palette.mode === "dark" ? "#FFC107" : theme.palette.text.primary
        }
        sx={{ marginBottom: "20px", fontWeight: "bold" }}
      >
        Events
      </Typography>

      {upcomingEvents.length > 0 ? (
        <Grid container spacing={2}>
          {upcomingEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  border: "1px solid transparent",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: 2,
                  backgroundColor: theme.palette.background.paper,
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={event.eventMediaUrl}
                  alt={event.topic}
                  sx={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ padding: "15px" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: "10px" }}
                    color={theme.palette.text.primary}
                  >
                    {event.topic}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ marginBottom: "10px" }}
                    color={theme.palette.text.secondary}
                  >
                    {event.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={theme.palette.text.primary}
                    dangerouslySetInnerHTML={{
                      __html: formatEventDate(event.startDate, event.endDate),
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color={theme.palette.text.primary}>No events.</Typography>
      )}
    </Box>
  );
};

export default UpcomingEvents;
