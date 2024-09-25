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
function App() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(reco);
  const [minTime, setMinTime] = useState(1);
  const [maxTime, setMaxTime] = useState(60);
  const audio = new Audio("music/music.mp3");
  const [hoverGetStarted, setHoverGetStarted] = useState(true);
  const [hoverToggleMusic, setHoverToggleMusic] = useState(true);

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
    if (e.id === "Enter") {
      handleSearch();
    }
  };

  const circleStyle = {
    height: "20vh",
    backgroundColor: "#7FC7D9",
    backgroundImage: `url(${imageCricle})`, // Set the background image
    backgroundSize: "cover",
  };

  //Fiest page /////////////////////////////////////////////////////////////////////////
  const canvasStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
  };

  const buttonContainerStyle = {
    position: "absolute",
    top: "70%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
  };

  // Updated to change size on hover
  const getButtonStyle = (isHovered) => ({
    backgroundColor: "#7FC7D9",
    color: "black",
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.5rem",
    position: "absolute",
    top: "100px",
    left: "250px",
    width: "175px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transform: isHovered ? "scale(1.1)" : "scale(1)", // Enlarge when hovered
    transition: "transform 0.3s ease", // Smooth transition for the transform
  });

  // Updated to change size on hover
  const getButton2Style = (isHovered) => ({
    backgroundColor: "#7FC7D9",
    padding: "0.5px",
    border: "none",
    borderRadius: "10px",
    position: "absolute",
    top: "-500px", // Adjust position for visibility
    left: "600px", // Adjust position for visibility
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transform: isHovered ? "scale(1.1)" : "scale(1)", // Enlarge when hovered
    transition: "transform 0.3s ease", // Smooth transition for the transform
  });

  const imgStyle = {
    width: "30px",
    height: "30px",
    margin: "10px",
  };

  useEffect(() => {
    setTimeout(() => {}, 500); // You can adjust the delay as needed

    audio.volume = 0.5;

    if (isMusicPlaying) {
      console.log(isMusicPlaying);
      audio.play();
    } else {
      console.log(isMusicPlaying);
      audio.pause();
    }
  }, [isMusicPlaying]);

  const handleButtonClick = () => {
    setTimeout(() => {
      window.location.href = "/login";
    }, 500); // You can adjust the delay as needed
    setIsMusicPlaying(false);
  };

  const handleToggleMusic = () => {
    setIsMusicPlaying((prevIsMusicPlaying) => !prevIsMusicPlaying);
  };
  return (
    <Router>
      <Switch>
        <Route path="/loginPageForTeacher">
          <LoginPageForTeacher />
        </Route>

        <Route path="/inputdata">
          <Inputdata admin="admin" />
        </Route>

        <Route path="/first">
          <div style={canvasStyle}>
            <Canvas shadows camera={{ position: [0, 2, 6], fov: 30 }}>
              <Suspense>
                <color attach="background" args={["#"]} />
                <ExperienceHome />
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
        </Route>

        <Route path="/signin">
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
        </Route>

        {/* Use map to create routes for each record */}
        {reco.map((record) => (
          <Route key={record.id} path={`/${record.id}`}>
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }}>
              <color attach="background" args={["#ececec"]} />
              <Suspense fallback={null}>
                <Experience texture={record.texture} />
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
                backgroundColor: "#0F4F60",
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
                      <img src="public/texture/whiteLogo.png" alt="" />
                    </div>
                    <div className="">
                      <img src="public/texture/Title.png" alt="" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    className="field border rounded-xl px-3 py-2 focus:scale-105 transition-transform duration-300 focus:border-cyan-200"
                    style={{
                      borderColor: "#0F1035",
                      margin: "0 3px",
                      width: "15vw",
                    }}
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button className="cursor-pointer p-3" onClick={handleSearch}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 48 48"
                    >
                      <path d="M21 3C11.621094 3 4 10.621094 4 20C4 29.378906 11.621094 37 21 37C24.710938 37 28.140625 35.804688 30.9375 33.78125L44.09375 46.90625L46.90625 44.09375L33.90625 31.0625C36.460938 28.085938 38 24.222656 38 20C38 10.621094 30.378906 3 21 3ZM21 5C29.296875 5 36 11.703125 36 20C36 28.296875 29.296875 35 21 35C12.703125 35 6 28.296875 6 20C6 11.703125 12.703125 5 21 5Z" />
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
                    className=" m-2 aspect-square  bg-cyan-200 rounded-full "
                  ></div>

                  <div
                    className="h-4/5 w-full bg-cyan-200 rounded-lg p-6"
                    style={{
                      backgroundColor: "#A7C8CB",
                      boxShadow: "3px 3px 5px #888888",
                    }}
                  >
                    <label className="title text-3xl font-bold  p-2 my-4 w-full">
                      Feedback
                    </label>
                    <div className="flex-col items-center mb-4 my-6 mx-2">
                      <div className="flex m-2">
                        <input type="checkbox" id="rating1" name="rating" />
                        <label htmlFor="rating1" className="ml-2">
                          Excellent
                        </label>
                      </div>
                      <div className="flex m-2">
                        <input type="checkbox" id="rating1" name="rating" />
                        <label htmlFor="rating1" className="ml-2">
                          Good
                        </label>
                      </div>
                      <div className="flex m-2">
                        <input type="checkbox" id="rating1" name="rating" />
                        <label htmlFor="rating1" className="ml-2 mr-4">
                          Average
                        </label>
                      </div>
                      <div className="flex m-2">
                        <input type="checkbox" id="rating1" name="rating" />
                        <label htmlFor="rating1" className="ml-2 mr-4">
                          Bad
                        </label>
                      </div>

                      <input
                        type="text"
                        style={{
                          height: "200px",
                        }}
                        placeholder="Provide your suggestions..."
                        className="border p-2 rounded-md my-2 w-full "
                      />

                      <button
                        className=" text-white py-2 px-4 rounded-md my-6"
                        style={{ backgroundColor: "#0F4F60" }}
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
                    left: "10px", // Adjust the left position as needed
                    backgroundColor: "#007bff",
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
                  />
                ))}
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
