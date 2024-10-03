import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import ProfileBar from "./ProfileBar";
import LogoBar from "./LogoBar";
import Menu from "./MenuBar";
import Cookies from "js-cookie";
import ReactionBoard from "./ReactionBoard";
import ReminderCalendar from "./ReminderCalendar";
import DashboardModules from "./DashboardModules";
import Noticeboard from "./Noticeboard";
import AddModule from "./AddModule";
import QandA from "./QandA";
import Footer from "./Footer";

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
      <QandA />
      {/* Profile Bar and Logo Bar */}
      <ProfileBar teacherId={teacherId} type="teacher" themeMode={themeMode} />
      <LogoBar themeMode={themeMode} />

      {/* Menu Bar without schedule button */}
      <Menu showScheduleButton={false} themeMode={themeMode} isHome={true} />

      {/* Main Content Section */}
      <div className="p-6 flex flex-wrap w-full">
        {/* Main Modules Dashboard taking up 3/4 of the screen */}
        <div className="w-3/4 pr-6">
          <DashboardModules teacherId={teacherId} themeMode={themeMode} />
        </div>

        {/* Reaction Board and Reminder Calendar taking up 1/4 of the screen */}
        <div className="w-1/4 flex-col py-9">
          <AddModule themeMode={themeMode} />
          <ReactionBoard />
          <div className="h-12"></div>
          <ReminderCalendar themeMode={themeMode} />
          <div>
            <Noticeboard themeMode={themeMode} />
          </div>
        </div>
      </div>
      <Footer themeMode={themeMode} />
    </div>
  );
};

export default DashBoardTeacher;
