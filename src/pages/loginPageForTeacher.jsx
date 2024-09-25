import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Inputdata from "./Inputdata";
import App from "../App";
const LoginPageForTeacher = () => {
  const [securityNumber, setSecurityNumber] = useState("");
  const [securityError, setSecurityError] = useState("");
  const history = useHistory();
  const Current_user = "admin";

  const handleSecuritySubmit = () => {
    if (securityNumber === "1234") {
      // Correct security number
      setSecurityError("");

      // Navigate to "/aiteacher"
      history.push("/inputdata");
    } else {
      // Incorrect security number
      setSecurityError("Incorrect security number. Please try again.");
    }
  };

  return (
    <Router>
      <Switch>
        <div
          style={{
            color: "#6DB9EF",
            width: "400px",
            height: "200px",
            fontSize: "30px",
            paddingLeft: "90px",
            paddingTop: "50px",
          }}
        >
          Enter Your Security Number:
          <input
            type="password"
            value={securityNumber}
            onChange={(e) => setSecurityNumber(e.target.value)}
          />
          <button onClick={handleSecuritySubmit}>Submit</button>
          <p style={{ color: "red" }}>{securityError}</p>
        </div>
      </Switch>
    </Router>
  );
};

export default LoginPageForTeacher;
