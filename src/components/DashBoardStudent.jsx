import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, useTheme, IconButton } from "@mui/material";
import ProfileBar from "./ProfileBar";
import LogoBar from "./LogoBar";
import Menu from "./MenuBar";
import Cookies from "js-cookie";
import RecentlyAddedModules from "./RecentlyAddedModules";
import AllAddedModules from "./AllAddedModules";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ReactionBoard from "./ReactionBoard";
import ReminderCalendar from "./ReminderCalendar";
import DashboardModulesStudent from "./DashboardModulesStudent";
import Noticeboard from "./Noticeboard";
import MenuBarStudent from "./MenuBarStudent";
import Footer from "./Footer";
import ReminderCalendarStudent from "./ReminderCalendarStudent";

const DashBoardStudent = ({ themeMode, toggleTheme }) => {
  const { batchNum } = useParams();
  const theme = useTheme();
  console.log(Cookies.get("studentId"));

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Dark Mode Toggle Button */}

      {/* Pass teacherId and themeMode as props to ProfileBar */}
      <ProfileBar
        teacherId={Cookies.get("studentId")}
        type="Student"
        themeMode={themeMode}
      />
      <LogoBar themeMode={themeMode} />
      {/* Pass a prop to indicate that this is not the Module details page */}
      <MenuBarStudent showScheduleButton={false} themeMode={themeMode} />

      {/* Main Content Section */}
      <div className="p-6 flex flex-wrap w-full">
        {/* Main Modules Dashboard taking up 3/4 of the screen */}
        <div className="w-3/4 pr-6">
          <DashboardModulesStudent themeMode={themeMode} />
        </div>

        {/* Reaction Board and Reminder Calendar taking up 1/4 of the screen */}
        <div className="w-1/4 flex-col py-9">
          <ReactionBoard />
          <div className="h-12"></div>
          <ReminderCalendarStudent themeMode={themeMode} />
          <div>
            <Noticeboard themeMode={themeMode} />
          </div>
        </div>
      </div>
      <Footer themeMode={themeMode} />
    </div>
  );
};

export default DashBoardStudent;
