// Navbar.jsx

import reco from "../data.json";
import "./Navbar.css"; // Import your CSS file
//in line 12 <a href="/inputdata">DATA INPUT PANEL</a>
import "./pages/loginPageForTeacher";

export default function Navbar() {
  return (
    <div className="navbar">
      <ul className="nav-list">
        <li>
          <a href="/loginPageForTeacher">DATA INPUT PANEL</a>
        </li>
        <li>
          <a>AI TEACHER</a>
        </li>
        {reco.map((records) => (
          <li key={records.id}>
            <a className="box bg-slate-300" href={`/${records.id}`}>
              {records.id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
