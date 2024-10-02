import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import Navbar from "./Navbar";
import reco from "../data.json";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Inputdata from "./pages/Inputdata";
import LoginPageForTeacher from "./pages/loginPageForTeacher";
import { Suspense } from "react";
import { Loader, Scroll, ScrollControls } from "@react-three/drei";
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { HomePageStudent } from "./pages/HomePageStudent";
import imageCricle from "../public/texture/human.png";
import { button } from "leva";
import "./App.css";
import { ExperienceLoginPage } from "./components/ExperienceLoginPage";
import Login from "./components/Login";
import SignIn from "./components/signup";
import img1 from "./assets/on.png";
import img2 from "./assets/off.png";
import { ExperienceHome } from "./components/ExperienceHome";
import LogoWhite from "./components/LogoWhite";
import DashBoardTeacher from "./components/DashBoardTeacher";
import ModuleDetails from "./components/ModuleDetails";
import MenuBar from "./components/MenuBar";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { TeacherInputData } from "./pages/TeacherInputData";
import Cookies from "js-cookie";
import Guidline from "./components/Guidline";
import { PreviewPage } from "./components/PreviewPage";
import ProfileBar from "./components/ProfileBar";
import LogoBar from "./components/LogoBar";
import DashBoardStudent from "./components/DashBoardStudent";

function App() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(reco);
  const [minTime, setMinTime] = useState(1);
  const [maxTime, setMaxTime] = useState(60);
  const [hoverGetStarted, setHoverGetStarted] = useState(true);
  const [hoverToggleMusic, setHoverToggleMusic] = useState(true);
  const [themeMode, setThemeMode] = useState(
    Cookies.get("themeMode") || "light"
  );

  const toggleTheme = () => {
    const newThemeMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newThemeMode);
    Cookies.set("themeMode", newThemeMode, { expires: 7 });
  };
  const currentTheme = themeMode === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 0.6 * window.screen.width) {
        setIsFeedbackVisible(false);
      } else {
        setIsFeedbackVisible(true);
      }
    };

    // Initial check on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleFeedbackVisibility = () => {
    setIsFeedbackVisible(!isFeedbackVisible);
  };

  const handleSearch = () => {
    const filtered = reco.filter((record) => {
      const moduleName = record.ModuleName && record.ModuleName.toString();
      return (
        moduleName &&
        moduleName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        record.Time >= minTime &&
        record.Time <= maxTime * 60 // Convert maxTime to seconds for comparison
      );
    });
    setFilteredData(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const circleStyle = {
    height: "20vh",
    backgroundColor: "#7FC7D9",
    backgroundImage: `url(${imageCricle})`, // Set the background image
    backgroundSize: "cover",
  };

  // First page /////////////////////////////////////////////////////////////////////////
  const canvasStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
  };

  return (
    <Router>
      <Switch>
        {/* Routes that are inside the ThemeProvider */}
        <Route path="/loginPageForTeacher">
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <LoginPageForTeacher themeMode={themeMode} />
          </ThemeProvider>
        </Route>

        <Route path="/Teacher/inputdata/:teacherId/:ModuleId">
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <TeacherInputData themeMode={themeMode} />
          </ThemeProvider>
        </Route>

        <Route path="/Events">
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <Event />
          </ThemeProvider>
        </Route>
        <Route path="/dashboard/GuidLines">
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <Guidline role={"teacher"} />
          </ThemeProvider>
        </Route>

        <Route path="/dashboard/teacher/:teacherId">
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <IconButton
              onClick={toggleTheme}
              style={{
                position: "absolute",
                top: 2,
                left: 10,
                zIndex: 1000,
              }}
              color="inherit"
            >
              {themeMode === "light" ? (
                <Brightness4Icon />
              ) : (
                <Brightness7Icon />
              )}
            </IconButton>
            <DashBoardTeacher themeMode={themeMode} toggleTheme={toggleTheme} />
          </ThemeProvider>
        </Route>

        <Route path="/dashboard/student/:batchNum">
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <IconButton
              onClick={toggleTheme}
              style={{
                position: "absolute",
                top: 2,
                left: 10,
                zIndex: 1000,
              }}
              color="inherit"
            >
              {themeMode === "light" ? (
                <Brightness4Icon />
              ) : (
                <Brightness7Icon />
              )}
            </IconButton>
            <DashBoardStudent themeMode={themeMode} toggleTheme={toggleTheme} />
          </ThemeProvider>
        </Route>

        <Route path="/GetTopicsByModuleId/:teacherId/:moduleId">
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <IconButton
              onClick={toggleTheme}
              style={{
                position: "absolute",
                top: 2,
                left: 10,
                zIndex: 1000,
              }}
              color="inherit"
            >
              {themeMode === "light" ? (
                <Brightness4Icon />
              ) : (
                <Brightness7Icon />
              )}
            </IconButton>
            <ModuleDetails themeMode={themeMode} />
          </ThemeProvider>
        </Route>

        <Route exact path="/">
          <div style={canvasStyle}>
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
              <Suspense>
                <color attach="background" args={["#"]} />
                <ExperienceHome />
              </Suspense>
            </Canvas>
            <Loader />
          </div>
        </Route>

        <Route exact path="/preview">
          <ThemeProvider theme={currentTheme}>
            <div style={canvasStyle}>
              <PreviewPage themeMode={themeMode} />
            </div>
          </ThemeProvider>
        </Route>

        {/* Routes that are outside the ThemeProvider */}
        <Route path="/Learning">
          <div style={canvasStyle}>
            <Canvas shadows camera={{ position: [0, 0, 9.5], fov: 40 }}>
              <Suspense fallback={null}>
                <Experience />
              </Suspense>
            </Canvas>
            <Loader />
          </div>
        </Route>

        <Route path="/first">
          <div style={canvasStyle}>
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
              <Suspense>
                <color attach="background" args={["#"]} />
                <ExperienceHome />
              </Suspense>
            </Canvas>
            <Loader />
          </div>
        </Route>

        <Route path="/login">
          <div style={canvasStyle}>
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
              <color attach="background" args={["#ececec"]} />
              <ScrollControls pages={0} damping={0.1}>
                <Suspense fallback={null}>
                  <ExperienceLoginPage />
                  <Scroll html>
                    <div className="loging">
                      <Login />
                    </div>
                  </Scroll>
                </Suspense>
              </ScrollControls>
            </Canvas>
            <Loader />
          </div>
        </Route>

        <Route path="/signin">
          <div style={canvasStyle}>
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
              <color attach="background" args={["#ececec"]} />
              <ScrollControls pages={0} damping={0.1}>
                <Suspense fallback={null}>
                  <ExperienceLoginPage />
                  <Scroll html>
                    <div className="signin">
                      <SignIn />
                    </div>
                  </Scroll>
                </Suspense>
              </ScrollControls>
            </Canvas>
            <Loader />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
