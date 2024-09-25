import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const HomePageStudent = (props) => {
  const { department, ModuleName, Time, Batch, id } = props;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const history = useHistory();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = () => {
    // Use history.push to navigate to the JSON file based on its ID
    history.push(`/${id}`);

    window.location.reload();
    // You can add additional logic here if needed, such as fetching new data
  };

  return (
    <div className="mainContainer m-2">
      <button
        className={`subjectBox ${
          windowWidth > 1024 ? "w-full" : "w-1/3"
        } h-48 bg-cyan-200 rounded-lg flex justify-start items-center flex-col m-5 text-left shadow-md`}
        onClick={handleClick}
        style={{ backgroundColor: "#A7C8CB" }}
      >
        <div
          className={`SecondBox w-5/6 h-1/2 bg-cyan-400 flex my-4 rounded-lg items-end justify-start shadow-md`}
          style={{ backgroundColor: "#0F4F60", opacity: "1" }}
        >
          <div className="CSE w-1/2 h-1/3 bg-white mx-2 -my-4 rounded-full flex justify-start items-center font-sans font-bold text-cyan-950">
            <div
              className="circle w-7 h-7 rounded-full mx-1"
              style={{ backgroundColor: "#0F4F60" }}
            ></div>
            {department}
          </div>
        </div>
        <div className="kk w-full h-1/3">
          <div className="TextComponent mx-3 font-sans font-bold text-cyan-950 text-base">
            {ModuleName}
          </div>
          <div className="jj flex justify-start items-center w-full py-1">
            <div className="TextComponent px-4 font-bold text-sm">
              {Math.round(Time / 60)} min
            </div>
            <div className="TextComponent px-4 font-bold text-sm">{Batch}</div>
          </div>
        </div>
      </button>
      <label
        className="name absolute font-mono font-bold text-sm"
        style={{
          margin: "auto",
          paddingLeft: "3vh",
        }}
      >
        {id}
      </label>
    </div>
  );
};
