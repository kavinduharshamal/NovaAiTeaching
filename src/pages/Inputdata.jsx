import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const API_KEY =
  "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";

const systemMessage = {
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

function Inputdata({ admin }) {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputData, setInputData] = useState(""); // State for input message

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
        {
          message: gptMessage,
          sender: "ChatGPT",
        },
      ]);
    } catch (error) {
      toast.error(
        "An error occurred while fetching the response from ChatGPT."
      );
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "#efefef",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <ToastContainer />

      <Paper
        sx={{
          height: "80vh",
          width: "70%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{ padding: 2, backgroundColor: "#3f51b5", color: "#fff" }}
        >
          Chat with ChatGPT
        </Typography>

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
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: 0.5,
                    color: message.sender === "ChatGPT" ? "#3f51b5" : "#000",
                  }}
                >
                  {message.sender === "user" ? "You" : "ChatGPT"}
                </Typography>
                <Typography variant="body1">{message.message}</Typography>
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
          <Button variant="contained" color="primary" onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Inputdata;
