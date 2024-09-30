import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  Paper,
  CircularProgress,
  Fab,
  Backdrop,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  Minimize as MinimizeIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_KEY =
  "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";

const systemMessage = {
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

export function TeacherInputData() {
  const [contentFields, setContentFields] = useState([
    { id: 1, content: "", file: null },
  ]);
  const [moduleCode, setModuleCode] = useState("");
  const [nameOfLecture, setNameOfLecture] = useState("");
  const [batchId, setBatchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputData, setInputData] = useState(""); // State for input message
  const [showPopup, setShowPopup] = useState(true); // Show chat on load

  const addContentField = () => {
    if (contentFields.length < 5) {
      setContentFields([
        ...contentFields,
        { id: contentFields.length + 1, content: "", file: null },
      ]);
    }
  };

  const handleContentChange = (index, value) => {
    const updatedFields = [...contentFields];
    updatedFields[index].content = value;
    setContentFields(updatedFields);
  };

  const handleFileChange = (index, file) => {
    const updatedFields = [...contentFields];
    updatedFields[index].file = file;
    setContentFields(updatedFields);

    if (file) {
      console.log(`file${index + 1} = ${file.name}`);
    }
  };

  const handleGenerateLecture = async () => {
    setIsLoading(true); // Show loading indicator

    const formData = new FormData();
    formData.append("moduleCode", moduleCode);
    formData.append("nameOfLecture", nameOfLecture);
    formData.append("batchId", batchId);

    contentFields.forEach((field, index) => {
      formData.append(`contents[${index}][id]`, field.id);
      formData.append(`contents[${index}][content]`, field.content);
      if (field.file) {
        formData.append(`${index + 1}`, field.file);
      } else {
        formData.append(
          `${index + 1}`,
          new File(
            [""],
            "/Users/kavinduharshamal/Desktop/aiTeacherReact/NovaAiTeaching/public/texture/github.png"
          )
        );
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/generateLecture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Lecture generated successfully!");
    } catch (error) {
      toast.error("Failed to generate lecture.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleSend = async () => {
    if (!inputData.trim()) {
      toast.error("Please enter a message before sending.");
      return;
    }

    const newMessage = {
      message: inputData,
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputData("");

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        apiRequestBody,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const gptMessage = response.data.choices[0].message.content;

      setMessages([
        ...chatMessages,
        { message: gptMessage, sender: "ChatGPT" },
      ]);
    } catch (error) {
      toast.error(
        "An error occurred while fetching the response from ChatGPT."
      );
    } finally {
      setIsTyping(false);
    }
  }

  const handleCopyToClipboard = (message) => {
    navigator.clipboard.writeText(message).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy!");
      }
    );
  };

  const handleOpenChat = () => {
    setShowPopup(true);
  };

  const handleMinimizeChat = () => {
    setShowPopup(false);
  };

  return (
    <Box sx={{ padding: 2, position: "relative" }}>
      {/* Full-screen loading overlay */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Processing, please wait...
        </Typography>
      </Backdrop>

      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Teacher Input Data
      </Typography>
      <TextField
        label="Module Code"
        variant="outlined"
        fullWidth
        value={moduleCode}
        onChange={(e) => setModuleCode(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Name of Lecture"
        variant="outlined"
        fullWidth
        value={nameOfLecture}
        onChange={(e) => setNameOfLecture(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Batch ID"
        variant="outlined"
        fullWidth
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {contentFields.map((field, index) => (
        <Box
          key={field.id}
          sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
        >
          <TextField
            label={`Content ${index + 1}`}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={field.content}
            onChange={(e) => handleContentChange(index, e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <IconButton color="primary" component="label" sx={{ marginLeft: 1 }}>
            <AttachFileIcon />
            <input
              type="file"
              accept=".png"
              hidden
              onChange={(e) => handleFileChange(index, e.target.files[0])}
            />
          </IconButton>
        </Box>
      ))}

      {contentFields.length < 5 && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addContentField}
        >
          Add More Content
        </Button>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateLecture}
        sx={{ marginTop: 2 }}
        disabled={isLoading}
      >
        Generate Lecture
      </Button>

      {/* Chat Button */}
      {!showPopup && (
        <Fab
          color="primary"
          onClick={handleOpenChat}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            animation: "pushOut 0.5s",
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Chat Popup */}
      {showPopup && (
        <Draggable handle=".draggable-handle">
          <div
            style={{
              position: "absolute",
              animation: "pushOut 0.5s",
              zIndex: "2",
            }}
          >
            <ResizableBox
              width={400}
              height={500}
              minConstraints={[300, 400]}
              maxConstraints={[900, 800]}
              axis="both"
              resizeHandles={["se"]}
              className="resizable-chat"
            >
              <Paper
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Draggable Handle */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 2,
                    backgroundColor: "#3f51b5",
                    color: "#fff",
                    cursor: "move",
                  }}
                  className="draggable-handle"
                >
                  <Typography variant="h6">Chat with ChatGPT</Typography>
                  <IconButton
                    onClick={handleMinimizeChat}
                    sx={{ color: "#fff" }}
                  >
                    <MinimizeIcon />
                  </IconButton>
                </Box>

                <List
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    padding: 2,
                    backgroundColor: "#ffffff",
                  }}
                >
                  {messages.map((message, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{
                        display: "flex",
                        justifyContent:
                          message.sender === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "60%",
                          padding: 1.5,
                          borderRadius: 2,
                          backgroundColor:
                            message.sender === "user" ? "#DCF8C6" : "#f1f1f1",
                          boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",
                          position: "relative",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            marginBottom: 0.5,
                            color:
                              message.sender === "ChatGPT" ? "#3f51b5" : "#000",
                          }}
                        >
                          {message.sender === "user" ? "You" : "ChatGPT"}
                        </Typography>
                        <Typography variant="body1">
                          {message.message}
                        </Typography>
                        {message.sender === "ChatGPT" && (
                          <IconButton
                            onClick={() =>
                              handleCopyToClipboard(message.message)
                            }
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              color: "#3f51b5",
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: "12px" }} />
                          </IconButton>
                        )}
                      </Box>
                    </ListItem>
                  ))}

                  {isTyping && (
                    <ListItem
                      alignItems="flex-start"
                      sx={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <Box
                        sx={{
                          maxWidth: "60%",
                          padding: 1.5,
                          borderRadius: 2,
                          backgroundColor: "#f1f1f1",
                          boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <CircularProgress size={20} sx={{ marginRight: 1 }} />
                        <Typography variant="body2" sx={{ display: "inline" }}>
                          ChatGPT is typing...
                        </Typography>
                      </Box>
                    </ListItem>
                  )}
                </List>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    borderTop: "1px solid #ddd",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message here..."
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    sx={{ marginRight: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </Box>
              </Paper>
            </ResizableBox>
          </div>
        </Draggable>
      )}

      <ToastContainer />

      {/* Animations */}
      <style>
        {`
          @keyframes pushOut {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes suckIn {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
}
