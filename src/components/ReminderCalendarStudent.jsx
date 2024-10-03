import React from "react";
import { useTheme } from "@mui/material/styles";

const ReminderCalendarStudent = () => {
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

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const styles = {
    container: {
      textAlign: "center",
      marginBottom: "40px", // Space below the container
    },
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
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      color: theme.palette.text.primary,
      marginBottom: "28px",
    },
    header: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "20px",
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
  };

  const renderDays = () => {
    const totalDays = [];
    let blankDays = firstDayOfMonth;

    for (let i = 0; i < blankDays; i++) {
      totalDays.push(<div key={`blank-${i}`} style={styles.emptyDayBox}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === currentDay;
      totalDays.push(
        <div
          key={`day-${i}`}
          style={{
            ...styles.dayBox,
            ...(isToday ? styles.dayBoxHighlighted : {}),
          }}
        >
          {i}
        </div>
      );
    }

    return totalDays;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Calendar</h1>
      <div style={styles.calendarContainer}>
        <div style={styles.header}>
          {monthNames[currentMonth]} {currentYear}
        </div>
        <div style={styles.weekRow}>
          {daysOfWeek.map((day, index) => (
            <div key={`dow-${index}`} style={styles.dayOfWeek}>
              {day}
            </div>
          ))}
        </div>
        <div
          style={{ flexWrap: "wrap", display: "flex", flexDirection: "row" }}
        >
          {renderDays()}
        </div>
      </div>
    </div>
  );
};

export default ReminderCalendarStudent;
