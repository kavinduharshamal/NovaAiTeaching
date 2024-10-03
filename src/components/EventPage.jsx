import React, { useState, useEffect } from "react";
import { ArrowDropDown } from "@mui/icons-material";
import {
  MenuItem,
  Select,
  FormControl,
  Button,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { subMonths, addMonths } from "date-fns";
import UpcomingEvents from "./UpcomingEvents";

import ProfileBar from "./ProfileBar";
import Cookies from "js-cookie";
import LogoBar from "./LogoBar";
import MenuBar from "./MenuBar";
import Footer from "./Footer";

// Styled Components
const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  color: theme.palette.text.primary,
  minWidth: "150px",
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

const EventPage = ({ currentTheme, toggleTheme }) => {
  const [dropdownValue, setDropdownValue] = useState("Upcoming Events");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setDropdownValue(selectedValue);
  };

  const currentMonth = new Date();
  const previousMonth = subMonths(currentMonth, 1);
  const nextMonth = addMonths(currentMonth, 1);
  console.log(currentTheme.palette.mode);

  return (
    <div
      style={{
        backgroundColor: currentTheme.palette.background.default,
      }}
    >
      <ProfileBar teacherId={Cookies.get("teacherId")} type={"teacher"} />
      <LogoBar />
      <MenuBar />
      <CssBaseline />
      <UpcomingEvents currentDate={currentDate} />
      <Footer themeMode={currentTheme.palette.mode} />
    </div>
  );
};

export default EventPage;
