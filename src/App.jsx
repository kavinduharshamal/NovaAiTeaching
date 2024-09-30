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

function App() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(reco);
  const [minTime, setMinTime] = useState(1);
  const [maxTime, setMaxTime] = useState(60);
  const [hoverGetStarted, setHoverGetStarted] = useState(true);
  const [hoverToggleMusic, setHoverToggleMusic] = useState(true);
  const [themeMode, setThemeMode] = useState("light");

  const toggleTheme = () => {
    setThemeMode((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <div className="app">
          {/* Dark Mode Toggle Button in Top Left Corner */}
          <IconButton
            onClick={toggleTheme}
            style={{ position: "absolute", top: 2, left: 10, zIndex: 1000 }}
            color="inherit"
          >
            {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>

          <Switch>
            <Route path="/loginPageForTeacher">
              <LoginPageForTeacher themeMode={themeMode} />
            </Route>

            <Route path="/Teacher/inputdata/:teacherId/:ModuleId">
              <TeacherInputData />
            </Route>
            <Route path="/Events">
              <Event />
            </Route>

            <Route path="/first">
              <div style={canvasStyle}>
                <Canvas shadows camera={{ position: [0, 2, 6], fov: 30 }}>
                  <Suspense>
                    <color attach="background" args={["#"]} />
                    <ExperienceHome themeMode={themeMode} />
                  </Suspense>
                </Canvas>
                <Loader />
              </div>
            </Route>

            <Route path="/login">
              <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
                <color attach="background" args={["#ececec"]} />
                <ScrollControls pages={0} damping={0.1}>
                  <Suspense fallback={null}>
                    <ExperienceLoginPage themeMode={themeMode} />
                    <Scroll html>
                      <div className="loging">
                        <Login themeMode={themeMode} />
                      </div>
                    </Scroll>
                  </Suspense>
                </ScrollControls>
              </Canvas>
              <Loader />
            </Route>

            <Route path="/signin">
              <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
                <color attach="background" args={["#ececec"]} />
                <ScrollControls pages={0} damping={0.1}>
                  <Suspense fallback={null}>
                    <ExperienceLoginPage themeMode={themeMode} />
                    <Scroll html>
                      <div className="signin">
                        <SignIn themeMode={themeMode} />
                      </div>
                    </Scroll>
                  </Suspense>
                </ScrollControls>
              </Canvas>
              <Loader />
            </Route>

            <Route
              path="/dashboard/teacher/:teacherId"
              render={() => (
                <DashBoardTeacher
                  themeMode={themeMode}
                  toggleTheme={toggleTheme}
                />
              )}
            />
            <Route
              path="/GetTopicsByModuleId/:teacherId/:moduleId"
              render={() => <ModuleDetails themeMode={themeMode} />}
            />

            {/* Use map to create routes for each record */}
            {reco.map((record) => (
              <Route key={record.id} path={`/${record.id}`}>
                <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }}>
                  <color attach="background" args={["#ececec"]} />
                  <Suspense fallback={null}>
                    <Experience
                      texture={record.texture}
                      themeMode={themeMode}
                    />
                  </Suspense>
                </Canvas>
                <Loader />
              </Route>
            ))}

            <Route path="/">
              <div>
                <div
                  className="title rounded-b-xl shadow-lg"
                  style={{
                    backgroundColor: themeMode === "dark" ? "#333" : "#0F4F60",
                  }}
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className="kk">
                      <div
                        className="flex top-0 left-0 -my-6"
                        style={{
                          zIndex: "1",
                          opacity: "1",
                          aspectRatio: "auto",
                          width: "30vh",
                        }}
                      >
                        <div className=" ">
                          <img
                            src={
                              themeMode === "dark"
                                ? "public/texture/whiteLogo.png"
                                : "public/texture/blackLogo.png"
                            }
                            alt=""
                          />
                        </div>
                        <div className="">
                          <img
                            src={
                              themeMode === "dark"
                                ? "public/texture/Title_white.png"
                                : "public/texture/Title.png"
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        className={`field border rounded-xl px-3 py-2 focus:scale-105 transition-transform duration-300 ${
                          themeMode === "dark"
                            ? "bg-gray-800 text-white border-gray-600"
                            : "bg-white text-black border-cyan-200"
                        }`}
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <button
                        className="cursor-pointer p-3"
                        onClick={handleSearch}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M21 3C11.621094 3 4 10.621094 4 20C4 29.378906 11.621094 37 21 37C24.710938 37 28.140625 35.804688 30.9375 33.78125L44.09375 46.90625L46.90625 44.09375L33.90625 31.0625C36.460938 28.085938 38 24.222656 38 20C38 10.621094 30.378906 3 21 3ZM21 5C29.296875 5 36 11.703125 36 20C36 28.296875 29.296875 35 21 35C12.703125 35 6 28.296875 6 20C6 11.703125 12.703125 5 21 5Z"
                            fill={themeMode === "dark" ? "#FFF" : "#000"}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="FeedbackContainer flex h-screen">
                  {isFeedbackVisible ? (
                    <div className="transition-all w-1/6 m-5 flex flex-col items-center justify-center ">
                      <div
                        style={circleStyle}
                        className={`m-2 aspect-square rounded-full ${
                          themeMode === "dark" ? "bg-gray-700" : "bg-cyan-200"
                        }`}
                      ></div>

                      <div
                        className="h-4/5 w-full rounded-lg p-6"
                        style={{
                          backgroundColor:
                            themeMode === "dark" ? "#555" : "#A7C8CB",
                          boxShadow: "3px 3px 5px #888888",
                        }}
                      >
                        <label
                          className={`title text-3xl font-bold p-2 my-4 w-full ${
                            themeMode === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          Feedback
                        </label>
                        <div className="flex-col items-center mb-4 my-6 mx-2">
                          {["Excellent", "Good", "Average", "Bad"].map(
                            (label, idx) => (
                              <div key={idx} className="flex m-2">
                                <input
                                  type="checkbox"
                                  id={`rating${idx}`}
                                  name="rating"
                                />
                                <label
                                  htmlFor={`rating${idx}`}
                                  className={`ml-2 ${
                                    themeMode === "dark"
                                      ? "text-white"
                                      : "text-black"
                                  }`}
                                >
                                  {label}
                                </label>
                              </div>
                            )
                          )}

                          <input
                            type="text"
                            style={{
                              height: "200px",
                            }}
                            placeholder="Provide your suggestions..."
                            className={`border p-2 rounded-md my-2 w-full ${
                              themeMode === "dark"
                                ? "bg-gray-700 text-white"
                                : "bg-white text-black"
                            }`}
                          />

                          <button
                            className={`text-white py-2 px-4 rounded-md my-6 ${
                              themeMode === "dark"
                                ? "bg-gray-800"
                                : "bg-[#0F4F60]"
                            }`}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="feedbackButton"
                      onClick={toggleFeedbackVisibility}
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor:
                          themeMode === "dark" ? "#007bff" : "#007bff",
                        color: "#fff",
                        padding: "10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Feedback
                    </button>
                  )}

                  <div className="flex flex-col grid grid-cols-5 w-4/5">
                    {filteredData.map((dta) => (
                      <HomePageStudent
                        key={dta.id}
                        department={dta.department}
                        ModuleName={dta.ModuleName}
                        Time={dta.Time}
                        Batch={dta.Batch}
                        id={dta.id}
                        themeMode={themeMode}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
