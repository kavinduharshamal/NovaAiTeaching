import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import ProfileBar from "./ProfileBar";
import LogoBar from "./LogoBar";
import MenuBar from "./MenuBar";
import Cookies from "js-cookie";

const Guideline = ({ role }) => {
  const theme = useTheme();
  const [roleText, setRoleText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [listItems, setListItems] = useState([]);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    const fetchedTeacherId = Cookies.get("teacherId");
    setTeacherId(fetchedTeacherId);

    if (role === "student") {
      setRoleText("-Students");
      setDisplayText(
        "Students are expected to be attired in a manner suited to the academic environment."
      );
      setListItems([
        "Male Students will not be permitted to wear fancy shirts, T-shirts without collars, jeans with multiple pockets, caps, and rubber slippers. They also will not be allowed to display untrimmed beards, fancy haircuts, long dyed or styled hair that is unsuitable to an academic environment.",
        "Female students will not be permitted to wear three-quarter jeans and trousers, jeans with multiple exposed pockets, mini skirts, deep neck or sleeveless blouses, and rubber slippers. They also will not be allowed fancy, dyed, or styled hair which is unsuitable for an academic environment.",
        "Both male and female students are not allowed to wear fancy jewellery.",
        "Apart from the above mentioned, anything not considered as an academically appropriate appearance is not allowed.",
      ]);
    } else if (role === "teacher") {
      setRoleText("-Teachers");
      setListItems([
        "Develop a clear syllabus that outlines course objectives, requirements, grading policies, and important dates.",
        "Create a detailed lesson plan for each class session, including learning outcomes, key topics, and teaching methods.",
        "Use a variety of teaching methods (lectures, discussions, group work, multimedia) to cater to different learning styles.",
        "Encourage active participation by asking questions, facilitating discussions, and using interactive activities.",
        "Foster open communication by being approachable and encouraging students to ask questions or seek help.",
        "Provide clear instructions for assignments and expectations for student performance.",
        "Manage your time effectively to maintain a balance between teaching responsibilities and personal well-being.",
      ]);
    }
  }, [role]);

  const textColor =
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : theme.palette.text.primary;

  const titleColor =
    theme.palette.mode === "dark"
      ? theme.palette.text.secondary
      : theme.palette.background.paper;

  return (
    <>
      <ProfileBar teacherId={1} type={"student"} />
      <LogoBar />
      <MenuBar />
      <div
        style={{
          width: "100vw",
          height: "80vh",
          overflow: "hidden",
          background: theme.palette.background.default,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: textColor,
        }}
      >
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: theme.palette.primary.main,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: "500px",
            width: "100%",
            minHeight: "500px",
            textAlign: "left",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "40px",
                color: titleColor,
              }}
            >
              {role === "student"
                ? "Guide to Thrive"
                : "Teaching Best Practices"}
            </h2>
            <p style={{ color: textColor }}>{displayText}</p>

            {/* Render list items for both students and teachers */}
            {listItems.length > 0 && (
              <ul
                style={{
                  listStyleType: "disc",
                  marginTop: "20px",
                  paddingLeft: "20px",
                  color: textColor,
                }}
              >
                {listItems.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Guideline;
