// Event.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import {
  FolderOpen,
  ArrowForwardIos,
  UnfoldLess,
  Menu,
  ArrowDropDown,
} from "@mui/icons-material";
import { MenuItem, Select, FormControl, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { subMonths, addMonths } from "date-fns";

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "#0F4F60",
  "&:hover": {
    backgroundColor: "#145F74",
  },
  color: "white",
  minWidth: "auto",
  padding: "0",
  textAlign: "center",
  "& .MuiSelect-select": {
    padding: "5px 20px",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d3d3d3",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#50C878",
  },
}));

const WhiteStyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
  "& .MuiSelect-select": {
    padding: "5px",
    fontSize: "12px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#0F4F60",
  color: "#FFFFFF",
  marginTop: "20px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#145F74",
  },
}));

const DashedLine = styled("div")({
  borderTop: "1px dashed black",
  width: "450px",
  marginLeft: "16px",
  alignSelf: "center",
});

const CustomCalendar = styled(Calendar)({
  width: "350px",
  height: "auto",
  border: "none",
  "& .react-calendar__tile": {
    padding: "0.5em",
  },
});

const CustomCalendarWithGrid = styled(Calendar)({
  width: "900px",
  height: "900px",
  border: "none",
  "& .react-calendar__tile": {
    padding: "1pm",
    border: "1px solid #d3d3d3",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "relative",
  },
  "& .react-calendar_month-viewdays_day": {
    borderBottom: "1px solid #d3d3d3",
    borderRight: "1px solid #d3d3d3",
  },
  "& .react-calendar_month-viewdays_day--neighboringMonth": {
    visibility: "hidden",
  },
});

const Event = () => {
  const [dropdownValue, setDropdownValue] = useState("Upcoming Events");
  const [secondDropdownValue, setSecondDropdownValue] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [upcomingEventsVisible, setUpcomingEventsVisible] = useState(true);
  const [showNewCalendar, setShowNewCalendar] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
  }, []);

  useEffect(() => {
    setUpcomingEventsVisible(dropdownValue === "Upcoming Events");
    setShowNewCalendar(dropdownValue === "Month");
  }, [dropdownValue]);

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setDropdownValue(selectedValue);
  };

  const handleSecondDropdownChange = (event) => {
    setSecondDropdownValue(event.target.value);
  };

  const handleButtonClick = () => {
    navigate("/new-event"); // Navigate to NewEvent component when button is clicked
  };

  const currentMonth = new Date();
  const previousMonth = subMonths(currentMonth, 1);
  const nextMonth = addMonths(currentMonth, 1);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentDate);

  return (
    <div>
      <nav style={{ padding: "10px", backgroundColor: "#F5F5F5" }}>
        <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              color: "black",
              textDecoration: "none",
            }}
          >
            <FolderOpen style={{ marginRight: "8px", color: "black" }} />
            <ArrowForwardIos
              style={{ marginLeft: "8px", color: "black", fontSize: "12px" }}
            />
            <span style={{ padding: "0 8px" }}>Site pages</span>
            <ArrowForwardIos
              style={{ marginLeft: "8px", color: "black", fontSize: "12px" }}
            />
            <span style={{ padding: "0 8px" }}>Calendar</span>
          </li>
        </ul>
      </nav>

      <div
        style={{
          marginLeft: "10px",
          marginTop: "50px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FormControl style={{ marginRight: "16px", minWidth: "auto" }}>
          <StyledSelect
            value={dropdownValue}
            onChange={handleDropdownChange}
            displayEmpty
            IconComponent={() => <ArrowDropDown style={{ color: "white" }} />}
          >
            <MenuItem value="Day">Day</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
            <MenuItem value="Upcoming Events">Upcoming Events</MenuItem>
          </StyledSelect>
        </FormControl>

        <FormControl style={{ marginLeft: "16px", minWidth: 300 }}>
          <WhiteStyledSelect
            value={secondDropdownValue}
            onChange={handleSecondDropdownChange}
            displayEmpty
            IconComponent={UnfoldLess}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  fontSize: "12px",
                },
              },
            }}
          >
            <MenuItem value="Option 1">Option 1</MenuItem>
            <MenuItem value="Option 2">Option 2</MenuItem>
            <MenuItem value="Option 3">Option 3</MenuItem>
          </WhiteStyledSelect>
        </FormControl>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            marginLeft: "auto",
            marginTop: "-25px",
          }}
        >
          <StyledButton
            variant="contained"
            onClick={handleButtonClick}
            style={{ marginBottom: "5px" }}
          >
            New event
          </StyledButton>
          <DashedLine />
        </div>
      </div>

      <div
        style={{
          marginLeft: "-750px",
          marginTop: "20px",
          fontSize: "25px",
          color: "black",
          textAlign: "right",
          width: "100%",
          height: "80px",
          overflow: "hidden",
        }}
      >
        {dropdownValue === "Day" ? formattedDate : null}
        {upcomingEventsVisible && (
          <div style={{ marginTop: "20px" }}>Upcoming Events</div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "-75px",
          marginRight: "260px",
        }}
      >
        <span
          style={{
            fontSize: "25px",
            color: "black",
            fontWeight: "bold",
            marginRight: "8px",
          }}
        >
          <Menu />
        </span>
        <span style={{ fontSize: "25px", color: "black" }}>Monthly View</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginTop: "10px",
          padding: "0 40px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <CustomCalendar
            value={previousMonth}
            view="month"
            showNeighboringMonth={false}
          />
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {showNewCalendar ? (
            <CustomCalendarWithGrid
              value={currentDate}
              view="month"
              showNeighboringMonth={false}
            />
          ) : (
            <CustomCalendar
              value={currentDate}
              view="month"
              showNeighboringMonth={false}
            />
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <CustomCalendar
            value={nextMonth}
            view="month"
            showNeighboringMonth={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Event;
