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

const DashBoardTeacher = ({ themeMode, toggleTheme }) => {
  const { teacherId } = useParams();
  const theme = useTheme();

  useEffect(() => {
    if (teacherId) {
      // Save teacherId as a cookie
      Cookies.set("teacherId", teacherId, { expires: 7 });
      console.log("cookie set"); // Cookie expires in 7 days
    }
  }, [teacherId]);

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
      <ProfileBar teacherId={teacherId} type="teacher" themeMode={themeMode} />
      <LogoBar themeMode={themeMode} />
      {/* Pass a prop to indicate that this is not the Module details page */}
      <Menu showScheduleButton={false} themeMode={themeMode} />

      {/* Main content layout with flex container */}
      <div className="p-6 flex flex-wrap w-full">
        {/* Recently Added Modules and All Added Modules */}
        <div className="w-3/4 pr-6">
          <div className="mb-4">
            <RecentlyAddedModules teacherId={teacherId} themeMode={themeMode} />
          </div>

          {/* Horizontal Divider */}
          <hr
            className={`border-t-1 my-4 w-full ${
              themeMode === "dark" ? "border-white" : "border-[#0F4F60]"
            }`}
          />

          <div>
            <AllAddedModules teacherId={teacherId} themeMode={themeMode} />
          </div>
        </div>
        {/* Reaction Board - Takes up 1/4 of the screen */}
        <div className="w-1/4 flex-col py-9">
          <ReactionBoard />
          <div className="h-12"></div>
          <ReminderCalendar themeMode={themeMode} />
        </div>
      </div>
    </div>
  );
};

export default DashBoardTeacher;
