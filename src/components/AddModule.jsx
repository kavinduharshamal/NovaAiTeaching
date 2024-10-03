import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  createTheme,
} from "@mui/material";
import Cookies from "js-cookie";

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

function AddModule({ themeMode }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    TeacherId: Cookies.get("teacherId"), // Hard code TeacherId to 1
    BatchNumber: "",
    ModuleName: "",
    SemesterNumber: "",
    Year: new Date().getFullYear().toString(), // Set current year automatically
    ModuleCode: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleAddModule = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSaveModule = async () => {
    // Basic validation to ensure all fields are filled
    const { BatchNumber, ModuleName, SemesterNumber, ModuleCode } = formValues;

    console.log("Current Form Values:", formValues);

    if (
      !BatchNumber.trim() ||
      !ModuleName.trim() ||
      !SemesterNumber.trim() ||
      !ModuleCode.trim()
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch(
        "https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Module",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        let responseData;

        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        console.log("Module data saved:", responseData);
        setDialogOpen(false);
        setSnackbarOpen(true); // Show success message

        // Clear the input fields after saving the data
        setFormValues({
          TeacherId: Cookies.get("teacherId"),
          BatchNumber: "",
          ModuleName: "",
          SemesterNumber: "",
          Year: new Date().getFullYear().toString(),
          ModuleCode: "",
        });
        window.location.reload();
      } else {
        console.error("Failed to save module:", response.statusText);
        alert(`Failed to save module: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error occurred while saving module:", error);
      alert("Error occurred while saving module. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={themeMode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline /> {/* Ensures the background applies correctly */}
      <div style={{ padding: 20, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddModule}
          style={{
            backgroundColor: themeMode === "dark" ? undefined : "#FFFFFF",
            color: themeMode === "dark" ? undefined : "#000000",
            fontWeight: "bold",
          }}
        >
          Add Module
        </Button>

        {/* Dialog for Adding Module */}
        <Dialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          sx={{ "& .MuiPaper-root": { borderRadius: 6 } }}
        >
          <DialogTitle
            style={{
              backgroundColor: "#0F4F60",
              color: "#FFFFFF",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Add New Module
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              {[
                {
                  label: "Batch Number",
                  name: "BatchNumber",
                  type: "select",
                  options: ["21.1", "21.2", "21.3", "22.1", "22.2", "22.3"],
                },
                { label: "Module Name", name: "ModuleName", type: "text" },
                {
                  label: "Semester Number",
                  name: "SemesterNumber",
                  type: "select",
                  options: ["1", "2"],
                },
                { label: "Year", name: "Year", type: "text", readOnly: true },
                { label: "Module Code", name: "ModuleCode", type: "text" },
              ].map((field, index) => (
                <Box key={index} display="flex" gap={2} alignItems="center">
                  <Typography
                    variant="body1"
                    style={{
                      width: "150px", // Fixed width to allow full label display
                      fontWeight: "bold",
                      color: themeMode === "dark" ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {field.label}
                  </Typography>

                  {field.type === "select" ? (
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      sx={{ borderRadius: 6 }}
                    >
                      <Select
                        name={field.name}
                        value={formValues[field.name]}
                        onChange={handleFormChange}
                        displayEmpty
                        style={{
                          color: themeMode === "dark" ? "#FFFFFF" : "#000000",
                        }}
                        sx={{ borderRadius: 6 }}
                      >
                        <MenuItem value="" disabled>
                          {field.label}
                        </MenuItem>
                        {field.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      name={field.name}
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={formValues[field.name]}
                      onChange={handleFormChange}
                      InputLabelProps={{
                        style: {
                          color: themeMode === "dark" ? "#FFFFFF" : "#000000",
                        },
                      }}
                      InputProps={{
                        readOnly: field.readOnly,
                        sx: {
                          borderRadius: 6,
                        },
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSaveModule}
              color="primary"
              variant="contained"
              sx={{ borderRadius: 6 }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Success Message */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Move to the top of the page
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Added New Module Successfully
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default AddModule;
