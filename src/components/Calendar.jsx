import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";

const Calendar = ({ monthNumber, highlightedDates, highlightedMessages }) => {
  const theme = useTheme();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // State for handling the hovered date and message
  const [hoveredDate, setHoveredDate] = useState(null);

  // Inline style for the component
  const styles = {
    calendarContainer: {
      display: "flex",
      flexDirection: "column",
      width: "350px",
      margin: "0 auto",
      padding: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      backgroundColor: theme.palette.background.paper,
      position: "relative",
    },
    header: {
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: theme.palette.text.primary,
    },
    weekRow: {
      display: "flex",
    },
    dayBox: {
      width: "45px",
      height: "45px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "2px",
      borderRadius: "50%",
      cursor: "pointer",
      position: "relative",
      color: theme.palette.text.primary,
    },
    dayBoxHighlighted: {
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
      fontWeight: "bold",
    },
    dayOfWeek: {
      fontWeight: "bold",
      width: "45px",
      height: "45px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: theme.palette.text.secondary,
    },
    emptyDayBox: {
      width: "45px",
      height: "45px",
      margin: "2px",
    },
    messageTooltip: {
      position: "absolute",
      top: "-30px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "5px 10px",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      borderRadius: "4px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      zIndex: 10,
    },
  };

  // Function to calculate days in a given month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const year = new Date().getFullYear();
  const daysInMonth = getDaysInMonth(monthNumber - 1, year);
  const firstDayOfMonth = new Date(year, monthNumber - 1, 1).getDay();

  // Render calendar days
  const renderDays = () => {
    const totalDays = [];
    let blankDays = firstDayOfMonth;

    // Fill in empty days before the start of the month
    for (let i = 0; i < blankDays; i++) {
      totalDays.push(<div key={`blank-${i}`} style={styles.emptyDayBox}></div>);
    }

    // Fill in the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isHighlighted = highlightedDates.includes(i);
      const message = highlightedMessages[i];

      totalDays.push(
        <div
          key={`day-${i}`}
          style={{
            ...styles.dayBox,
            ...(isHighlighted ? styles.dayBoxHighlighted : {}),
          }}
          onMouseEnter={() => setHoveredDate(i)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {i}
          {hoveredDate === i && message && (
            <div style={styles.messageTooltip}>{message}</div>
          )}
        </div>
      );
    }

    return totalDays;
  };

  return (
    <div style={styles.calendarContainer}>
      {/* Render the month name */}
      <div style={styles.header}>
        {monthNames[monthNumber - 1]} {year}
      </div>
      {/* Render days of the week */}
      <div style={styles.weekRow}>
        {daysOfWeek.map((day, index) => (
          <div key={`dow-${index}`} style={styles.dayOfWeek}>
            {day}
          </div>
        ))}
      </div>
      {/* Render calendar days */}
      <div style={{ flexWrap: "wrap", display: "flex", flexDirection: "row" }}>
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
