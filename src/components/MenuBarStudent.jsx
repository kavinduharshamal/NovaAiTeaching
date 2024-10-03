import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

// Styling the AppBar
const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "50px",
  boxShadow: "none",
}));

// Styling the Toolbar
const CustomToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
});

// Styling for the buttons
const CustomButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "14px",
  marginLeft: "20px",
  padding: "0.3rem 0.6rem",
  borderRadius: "8px",
  transition: "color 0.3s ease, background-color 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

// Styling for the Schedule button
const ScheduleButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.secondary,
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "10px",
  padding: "0.6rem 1rem",
  marginBottom: "0.8rem",
}));

const MenuBarStudent = ({ showScheduleButton, toggleTheme, themeMode }) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const teacherId = Cookies.get("teacherId");
  const { moduleId } = useParams();

  const handleButtonClick = (page) => {
    console.log(`${page} clicked)`);
    window.location.href = `/dashboard/Student/${Cookies.get("batchId")}`;
  };
  const handleButtonClickGuidline = (page) => {
    console.log(`${page} clicked`);
    window.location.href = "/dashboard/Student/GuidLines";
  };

  const handleButtonClickOnlineReference = (page) => {
    console.log(`${page} clicked`);
    window.location.href = "/dashboard/Student/online_Reference";
  };

  const handleButtonClickEvents = (page) => {
    console.log(`${page} clicked`);
    window.location.href = "/dashboard/eventstudent";
  };

  return (
    <>
      <CustomAppBar position="static">
        <CustomToolbar>
          {/* Left aligned menu buttons */}
          <div>
            <CustomButton onClick={() => handleButtonClick("Home")}>
              Home
            </CustomButton>
            <CustomButton onClick={() => handleButtonClickEvents("Events")}>
              Events
            </CustomButton>

            <CustomButton
              onClick={() => handleButtonClickGuidline("Guidelines")}
            >
              Technical Guidelines
            </CustomButton>
            <CustomButton
              onClick={() =>
                handleButtonClickOnlineReference("Online Reference")
              }
            >
              Online Reference
            </CustomButton>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Conditionally show the Schedule button */}
            {showScheduleButton && (
              <ScheduleButton
                onClick={() =>
                  (window.location.href = `/Teacher/inputdata/${teacherId}/${moduleId}`)
                }
              >
                Schedule a new Lecture
              </ScheduleButton>
            )}
          </div>
        </CustomToolbar>
      </CustomAppBar>

      {/* Divider below the MenuBar */}
      <Divider sx={{ borderColor: "#0F4F60", borderWidth: "1px" }} />
    </>
  );
};

export default MenuBarStudent;
