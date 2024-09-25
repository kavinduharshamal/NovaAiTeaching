import React, { useState } from "react";
import axios from "axios";
import LogoWhite from "./LogoWhite";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignIn = () => {
  const [firstname, setUserFirstname] = useState("");
  const [lastname, setUserLastname] = useState("");
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Create the model to send to the backend
    const userModel = {
      firstname,
      lastname,
      email,
      password,
    };

    try {
      // Send the data to the backend
      const response = await axios.post(
        "https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Teacher",
        userModel
      );

      if (response.data != null) {
        // Redirect or update the UI on successful sign up
        window.location.href = "/login";
      }
    } catch (error) {
      setErrorMessage("Error creating account. Please try again.");
      console.error("There was an error creating the account!", error);
    }
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
          SIGNUP
        </label>
        <label
          className="text-center text-white text-l font-mono"
          style={{ paddingBottom: "20px" }}
        >
          Create Your NOVA{" "}
        </label>
        <input
          type="text"
          placeholder="FirstName"
          style={{ width: "150%", height: "60px" }}
          className={` px-4 py-2 border m-2 rounded-md focus:outline-none focus:border-blue-500`}
          value={firstname}
          onChange={(e) => setUserFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="LastName"
          style={{ width: "150%", height: "60px" }}
          className={` px-4 py-2 border m-4 rounded-md focus:outline-none focus:border-blue-500`}
          value={lastname}
          onChange={(e) => setUserLastname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          style={{ width: "150%", height: "60px" }}
          className={` px-4 py-2 border m-2 rounded-md focus:outline-none focus:border-blue-500`}
          value={email}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <div style={{ position: "relative", width: "150%", height: "60px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            style={{ width: "100%", height: "60px" }}
            className={` px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500`}
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

        {/* Confirm Password Input */}
        <div style={{ position: "relative", width: "150%", height: "60px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            style={{ width: "100%", height: "60px" }}
            className={` px-4 py-2 border my-2 rounded-md focus:outline-none focus:border-blue-500`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          onClick={handleSignIn}
          style={{ width: "150%", height: "60px", backgroundColor: "#7FC7D9" }}
          className="mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignIn;
