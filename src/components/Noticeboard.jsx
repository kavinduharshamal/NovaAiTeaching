import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { lightTheme, darkTheme } from "../theme";

const newsItems = [
  {
    news: "TIDAC Research Symposium will be held on 30th October",
    image:
      "https://img.freepik.com/free-photo/young-man-woman-protective-glasses-doing-experiments-robotics-laboratory-robot_1268-23358.jpg?t=st=1727852869~exp=1727856469~hmac=b9fd2fd55386eef09bf8d25dc5c76fd8421bfea8b4d8ab28449dca4134ce9d0c&w=1380",
  },
  {
    news: "Fusion, the largest engineering exhibition, will be on 20th December",
    image:
      "https://img.freepik.com/free-photo/group-teens-doing-experiments-robotics-laboratory-boy-girls-protective-vr_1268-23740.jpg?t=st=1727860841~exp=1727864441~hmac=727613d249f9341cf83bfe3918e691785de7f718a0eef8bd15b1894906051dc0&w=1380",
  },
  {
    news: "NSBM Faculty of Engineering to launch new IoT Lab in November",
    image:
      "https://img.freepik.com/free-photo/people-repairing-computer-chips_23-2150880942.jpg?t=st=1727860879~exp=1727864479~hmac=d99cf08aa448142b805c99f4a882a66edb1d34705fa7818e9275ef7b15f4648f&w=1380",
  },
  {
    news: "Hackathon 2024: A 24-hour coding marathon starting 5th December",
    image:
      "https://img.freepik.com/free-photo/two-young-men-vr-glasses-doing-experiments-robotics-laboratory-robot-table_1268-24415.jpg?t=st=1727860946~exp=1727864546~hmac=fd452e217ae996628d3d1ad4bd221d9c6e5bf3f27c63a978ed6f1101045247e8&w=1380",
  },
  {
    news: "Robotics Workshop for freshers on 10th November",
    image:
      "https://img.freepik.com/free-photo/teens-doing-experiments-robotics-laboratory-boy-girl-protective-glasses-working_1268-23736.jpg?t=st=1727861614~exp=1727865214~hmac=df2634eb32d5c945fc82017f321d71a97bf11ef6750360d059e584df3f4d6d4e&w=1380",
  },
  {
    news: "Guest Lecture on Artificial Intelligence by Dr. Smith on 18th October",
    image:
      "https://img.freepik.com/free-photo/mechanic-shows-client-car-parts-hologram_482257-76685.jpg?t=st=1727861696~exp=1727865296~hmac=4f1f8594c8b990dc5cc4eb4b4762c28404ea9078863d45a14853b26178f712c4&w=1380",
  },
  {
    news: "Engineering Open Day to be held on 22nd November",
    image:
      "https://img.freepik.com/free-photo/futuristic-robotic-arm-turning-metal-workshop-generated-by-ai_188544-24601.jpg?t=st=1727861770~exp=1727865370~hmac=fd23cae3ff0165663b8096ab3a02ae9c1bac3155a3decb94fc8af0af9a716b3f&w=1380",
  },
  {
    news: "Final Year Project Showcase happening on 5th November",
    image:
      "https://img.freepik.com/free-photo/group-young-teens-celebrating-world-youth-day-by-doing-activities-together_23-2151478298.jpg?t=st=1727861882~exp=1727865482~hmac=4d3c8c824c56d9911aca5bc0bb50b6e3bc14af7a1c814ea7810f9b6d31832265&w=1380",
  },
];

const Noticeboard = ({ themeMode }) => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(
    Math.floor(Math.random() * newsItems.length)
  );

  const theme = useTheme();

  // Automatically change news every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 3000);

    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleNext = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const handlePrevious = () => {
    setCurrentNewsIndex(
      (prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length
    );
  };

  // Get today's date in "Month daySuffix" format
  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const daySuffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    const month = date.toLocaleString("default", { month: "long" });
    return `${month} ${day}${daySuffix}`;
  };

  return (
    <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <Card
        style={{
          backgroundColor:
            themeMode === "light" ? "#FFFFFF" : theme.palette.primary.main,
          color: themeMode === "light" ? "#000000" : "#FFFFFF", // Set font color to black in light mode
          width: "300px",
          height: "400px", // Adjusted height to fit the image
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          margin: "20px auto",
          borderRadius: "12px",
          padding: "15px",
          position: "relative",
        }}
      >
        {/* Date Display with Clock Icon */}
        <Box
          style={{
            position: "absolute",
            top: "10px",
            left: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AccessTimeOutlinedIcon
            style={{
              fontSize: "15px",
              marginRight: "5px",
              color: themeMode === "light" ? "#000000" : "#FFFFFF",
            }}
          />
          <Typography
            variant="body2"
            style={{
              fontWeight: "bold",
              color: themeMode === "light" ? "#000000" : "#FFFFFF",
            }}
          >
            {getFormattedDate()}
          </Typography>
        </Box>

        {/* Arrows positioned closely in a horizontal line below the date and close to the news */}
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: "65px",
            left: "15px",
            gap: "5px",
          }}
        >
          <IconButton
            onClick={handlePrevious}
            style={{
              color: themeMode === "light" ? "#000000" : "#FFFFFF",
              padding: "1px",
            }}
          >
            <ArrowBackIosIcon fontSize="inherit" style={{ fontSize: "16px" }} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            style={{
              color: themeMode === "light" ? "#000000" : "#FFFFFF",
              padding: "1px",
            }}
          >
            <ArrowForwardIosIcon
              fontSize="inherit"
              style={{ fontSize: "16px" }}
            />
          </IconButton>
        </Box>

        {/* News text aligned to the left corner below the arrows */}
        <CardContent
          style={{
            textAlign: "left",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            flex: 1,
            width: "100%",
            padding: 0,
            marginTop: "90px",
          }}
        >
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              color: themeMode === "light" ? "#000000" : "#FFFFFF",
            }}
          >
            {newsItems[currentNewsIndex].news}
          </Typography>
        </CardContent>

        {/* Image at the bottom, filling the remaining space */}
        <Box
          style={{
            width: "100%",
            height: "230px",
            marginTop: "auto",
          }}
        >
          <img
            src={newsItems[currentNewsIndex].image}
            alt="Random Noticeboard Image"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "12px 12px 12px 12px",
              objectFit: "cover",
            }}
          />
        </Box>
      </Card>
    </ThemeProvider>
  );
};

export default Noticeboard;
