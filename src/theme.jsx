import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F4F60",
    },
    secondary: {
      main: "#148B9E",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2E3A3F", // Dark color for main text in light mode
      secondary: "#5C6B73",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0F4F60",
    },
    secondary: {
      main: "#148B9E",
    },
    background: {
      default: "#1A1A1A",
      paper: "#121212",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#FFC107",
    },
  },
});

export { lightTheme, darkTheme };
