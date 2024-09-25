import React from "react";

const LogoWhite = () => {
  return (
    <div
      className="flex absolute top-0 left-0"
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
  );
};

export default LogoWhite;
