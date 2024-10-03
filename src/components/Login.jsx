import React, { useState } from "react";
import { Switch, FormControlLabel } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LogoWhite from "./LogoWhite";
import Cookies from "js-cookie";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [usernameActive, setUsernameActive] = useState(false);
  const [passwordActive, setPasswordActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameFocus = () => {
    setUsernameActive(true);
    setPasswordActive(false);
  };

  const handlePasswordFocus = () => {
    setUsernameActive(false);
    setPasswordActive(true);
  };

  const handleLogin = async () => {
    console.log("pressed");
    if (userType === "teacher") {
      // Teacher login API call
      try {
        const response = await fetch(
          "https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Teacher/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: username,
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Successful teacher login
          console.log("Login successful:", data);
          const teacherId = data.id;
          Cookies.set("teacherId", `${teacherId}`, { expires: 7 });
          window.location.href = `http://localhost:5173/dashboard/Teacher/${Cookies.get(
            "teacherId"
          )}`;
        } else {
          setErrorMessage(data.message || "Invalid email or password");
        }
      } catch (error) {
        console.error("Error during teacher login:", error);
        setErrorMessage("An error occurred during login");
      }
    } else if (userType === "student") {
      // Student login API call
      try {
        const response = await fetch(
          "https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Student/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: username,
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Successful student login
          const batchId = parseInt(data.batchID);
          console.log(batchId);

          const batchIdWithoutDot = String(data.batchID).replace(/\./g, "");
          Cookies.set("batchIdWithoutDot", `${batchIdWithoutDot}`, {
            expires: 7,
          });
          console.log(data.batchID);
          console.log(data.id);
          Cookies.set("studentId", `${data.id}`, { expires: 7 });
          Cookies.set("batchId", `${batchId}`, { expires: 7 });

          console.log(Cookies.get("batchId"));
          window.location.href = `/dashboard/Student/${batchId}`; // Redirecting to student's batch page
        } else {
          setErrorMessage(data.message || "Invalid email or password");
        }
      } catch (error) {
        console.error("Error during student login:", error);
        setErrorMessage("An error occurred during login");
      }
    } else {
      setErrorMessage("Invalid username or password");
    }
  };

  const handleSignIN = () => {
    window.location.href = "/signin"; // Navigate to signup page
  };

  const handleUserTypeChange = () => {
    setUserType((prevType) => (prevType === "student" ? "teacher" : "student"));
  };

  return (
    <div
      className="window flex justify-center items-center h-screen w-full rounded-r-xl relative"
      style={{
        width: "300%",
        boxShadow: "rgba(0,0,0,0.15) 1.95px 1.95px 2.6px",
      }}
    >
      <LogoWhite />
      <div
        className="w-full h-full bg-slate-500 absolute top-0 left-0 rounded-r-xl"
        style={{ zIndex: "-1", opacity: "0.4" }}
      ></div>
      <div className="flex flex-col justify-center items-center">
        <label className="text-center text-white py-2 text-4xl font-mono">
          LOGIN
        </label>
        <label
          className="text-center text-white text-l font-mono"
          style={{ paddingBottom: "20px" }}
        >
          Logging to Your NOVA
        </label>

        {/* Material UI Toggle Switch for User Type */}
        <FormControlLabel
          control={
            <Switch
              checked={userType === "teacher"}
              onChange={handleUserTypeChange}
              color="primary"
            />
          }
          label={userType === "student" ? "Student" : "Teacher"}
          className="mb-4"
          style={{ color: "white" }}
        />

        <input
          type="text"
          placeholder="Username (Email for Teacher)"
          onFocus={handleUsernameFocus}
          onBlur={() => setUsernameActive(false)}
          style={{ width: "150%", height: "60px" }}
          className={`px-4 py-2 border m-2 ${
            usernameActive ? "border-blue-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:border-blue-500`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div style={{ position: "relative", width: "150%", height: "60px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onFocus={handlePasswordFocus}
            onBlur={() => setPasswordActive(false)}
            style={{ width: "100%", height: "60px" }}
            className={`px-4 py-2 border ${
              passwordActive ? "border-blue-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:border-blue-500`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-500 my-2 text-sm font-bold">{errorMessage}</p>
        )}
        <button
          onClick={handleLogin}
          style={{ width: "150%", height: "60px", backgroundColor: "#7FC7D9" }}
          className="mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
        <button
          onClick={handleSignIN}
          className="mt-4 text-white underline hover:text-blue-500"
          style={{ cursor: "pointer" }}
        >
          SignUp with a new account
        </button>
      </div>
    </div>
  );
};

export default Login;
