import { useState } from "react";
//import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { withRouter } from "react-router-dom/cjs/react-router-dom";

const API_KEY =
  "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

function Inputdata({ admin }) {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  //file uploader ////////////////////////////////////////////////////
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    console.log(file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  /*function generateMessage() {
    const userInput = document.getElementById("userInput").value;
    fetch("http://localhost:3000/generateMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }*/
  const [lectureName, setLectureName] = useState("");
  const [batch, setBatch] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [inputData, setInputData] = useState("");
  //const [fileInput, setFileInput] = useState("");

  const handleGenerate = () => {
    const loadingToastId = toast.loading("Hold for Complete the process", {
      autoClose: false, // To keep the loading toast until you manually clear it
    });
    handleUpload();
    // Log the data to the console
    console.log("Lecture Name:", lectureName);
    console.log("Input Data:", inputData, batch, moduleName, moduleCode);

    // Prepare the data object to send to the server
    const requestData = {
      message: inputData,
      name: lectureName,
      moduleName: moduleName,
      moduleCode: moduleCode,
      batch: batch,
      texture: file.name,
    };

    // Send a POST request to localhost:3000/voice
    fetch("http://localhost:3000/voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server if needed
        console.log("Server Response:", data);
        toast.dismiss(loadingToastId);
        toast.success("Successfully entered!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return admin === "admin" ? (
    <div className="Inputdata " style={{ backgroundColor: "#efefef" }}>
      <div className="felx-col">
        <div className="mainContainer flex">
          <div className="inputPanel flex-col">
            <div
              className="flex w-1/2 h-1/6"
              style={{
                height: "20vh",
              }}
            >
              <img src={"FirstPageImages/logoBlack.png"} />
              <img src={"FirstPageImages/TitleBlack.png"} />
            </div>
            <div className="textt text-3xl font-bold flex items-center justify-center my-3">
              ADMIN PANEL
            </div>
            <div
              style={{
                background: "white",
                height: "85vh",
                width: "87%",
                paddingTop: "50px",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
              }}
              className="inputpanel mx-7 rounded-2xl"
            >
              <p className="kk flex justify-center items-center">
                Please provide all the necessary
                <br /> details below. When uploading
                <br /> lecture materials, ensure the file <br />
                format is PNG or JPG. After
                <br />
                pressing the submit button, kindly <br />
                wait for the successful confirmation <br />
                message indicating that the lecture
                <br /> has been created.
              </p>
              <div className="my-7"></div>
              <input
                style={{
                  width: "80%",
                  height: "7%",
                  /* Add any additional styling for your text field here */
                  margin: "auto", // Center the input horizontally
                  display: "block",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                  marginBottom: "20px",
                  border: "1px solid",
                  padding: "16px",
                  // Make the input a block element
                }}
                className="custom-text-field rounded-lg  border-gray-500 "
                type="text"
                placeholder="Enter name of lecture"
                id="userName"
                value={lectureName}
                onChange={(e) => setLectureName(e.target.value)}
              />
              <input
                style={{
                  width: "80%",
                  height: "7%",
                  /* Add any additional styling for your text field here */
                  margin: "auto", // Center the input horizontally
                  display: "block",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                  marginBottom: "20px",
                  border: "1px solid",
                  padding: "16px",
                }}
                className="custom-text-field rounded-lg "
                type="text"
                placeholder="Enter name of Batch"
                id="Batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
              <input
                style={{
                  width: "80%",
                  height: "7%",
                  /* Add any additional styling for your text field here */
                  margin: "auto", // Center the input horizontally
                  display: "block",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                  marginBottom: "20px",
                  border: "1px solid",
                  padding: "16px",
                }}
                className="custom-text-field rounded-lg "
                type="text"
                placeholder="Enter name of ModuleName"
                id="modulename"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
              <input
                style={{
                  width: "80%",
                  height: "7%",
                  /* Add any additional styling for your text field here */
                  margin: "auto", // Center the input horizontally
                  display: "block",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                  marginBottom: "20px",
                  border: "1px solid",
                  padding: "16px",
                }}
                className="custom-text-field rounded-lg "
                type="text"
                placeholder="Enter name of ModuleCode"
                id="moduleCode"
                value={moduleCode}
                onChange={(e) => setModuleCode(e.target.value)}
              />
              <p
                className="py-3"
                style={{
                  width: "70%",
                  height: "20%",
                  /* Add any additional styling for your text field here */
                  margin: "auto", // Center the input horizontally
                  marginBottom: "2px",
                }}
              >
                Upload the Lecture
                <br /> Materials (jpg and png)
              </p>
              <div className="-my-10">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  dark:text-neutral-200 dark:file:bg-neutral-600 dark:file:text-neutral-100 dark:focus:border-primary"
                  style={{
                    margin: "0 auto", // Changed to "0 auto" to remove top margin
                    width: "90%",
                    height: "5%",
                    display: "flex",
                    backgroundColor: "#c6e3fa",
                    color: "#333", // Text color
                  }}
                />
              </div>
              <div className="my-16">
                <button
                  className="generate-button rounded"
                  style={{
                    margin: "auto", // Center the input horizontally
                    display: "block",
                    width: "30%",
                    height: "35px",
                    backgroundColor: "#c6e3fa",
                  }}
                  onClick={handleGenerate}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          <ToastContainer />
          <div
            style={{
              height: "110vh",
              backgroundColor: "white",
              width: "130vh",
              boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
            }}
            className="flex items-center justify-center my-8 rounded-2xl"
          >
            <div
              className="gptinterface my-16 rounded-lg"
              style={{
                position: "relative",
                height: "100vh",
                width: "130vh",
              }}
            >
              <MainContainer>
                <ChatContainer>
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={
                      isTyping ? (
                        <TypingIndicator content="ChatGPT is typing" />
                      ) : null
                    }
                  >
                    {messages.map((message, i) => {
                      console.log(message);
                      return <Message key={i} model={message} />;
                    })}
                  </MessageList>
                  <MessageInput
                    placeholder="Type message here"
                    onSend={handleSend}
                  />
                </ChatContainer>
              </MainContainer>
            </div>
          </div>
        </div>
        <div className="textarea" style={{ width: "100%" }}>
          <textarea
            style={{
              height: "40vh",
              boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
              width: "95%",
            }}
            className="custom-text-area flex items-center justify-center p-5 mx-10 my-4 rounded-2xl"
            placeholder="Enter the Generated Text Here"
            id="userInput"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          ></textarea>
        </div>
        <div className="empty h-16"></div>
      </div>
    </div>
  ) : (
    <div>you not allow</div>
  );
}

export default Inputdata;
