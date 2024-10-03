import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileBar from "./ProfileBar";
import LogoBar from "./LogoBar";
import MenuBar from "./MenuBar";
import Cookies from "js-cookie";
import { useTheme, Typography, Button } from "@mui/material";

export const ModuleDetails = ({ themeMode }) => {
  // Define the model inside the component
  class TopicModel {
    constructor(id, moduleId, topicName, url1, batchId) {
      this.id = id;
      this.moduleId = moduleId;
      this.topicName = topicName;
      this.url1 = url1; // Assuming only one URL for the topic name
      this.batchId = batchId;
    }

    // Static method to map raw API data to an instance of TopicModel
    static fromApi(data) {
      return new TopicModel(
        data.id,
        data.moduleId,
        data.topicName,
        data.url1,
        data.batchId
      );
    }
  }

  const { teacherId, moduleId } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleName, setModuleName] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [batchNumber, setBatchId] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await axios.get(
          `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/GetTopicsByModuleId/${moduleId}`
        );

        const ModuleName = await axios.get(
          `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Module/${moduleId}`
        );
        const BatchNumber = await axios.get(
          `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/GetModulesWithTopicsByTeacherId/${teacherId}`
        );

        setModuleName(ModuleName.data.moduleName);
        setModuleCode(ModuleName.data.moduleCode);
        setBatchId(BatchNumber.data.$values[0].batchNumber);

        // Extract the $values array from the response
        const topicsArray = response.data.$values;
        // Map the topics array to TopicModel instances
        const mappedTopics = topicsArray.map((topic) =>
          TopicModel.fromApi(topic)
        );
        setTopics(mappedTopics);
      } catch (error) {
        console.error("Error fetching module details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  const handleTopicClick = (topic) => {
    console.log(topic.topicName);
    console.log(moduleCode, batchNumber);

    const sanitizedModuleCode = String(moduleCode).replace(/\./g, "");
    const sanitizedBatchNumber = String(batchNumber).replace(/\./g, "");
    console.log(sanitizedModuleCode, sanitizedBatchNumber);

    const path = `${sanitizedModuleCode}_${topic.topicName}_${sanitizedBatchNumber}`;
    console.log(path);

    // Set a timeout before saving the cookie
    setTimeout(() => {
      Cookies.set("fileName", `${path}`, { expires: 7 });
      console.log("Cookie saved");
      console.log(Cookies.get("fileName"));

      // Redirect after setting the cookie
      window.location.href = "/Learning";
    }, 1000); // 1000 ms = 1 second delay
  };

  const handleSecondaryAction = (topic) => {
    // Define the action for the right-side button
    console.log(`Secondary action for topic: ${topic.topicName}`);
    console.log(topic.topicName);
    console.log(moduleCode, batchNumber);

    const sanitizedModuleCode = String(moduleCode).replace(/\./g, "");
    const sanitizedBatchNumber = String(batchNumber).replace(/\./g, "");
    console.log(sanitizedModuleCode, sanitizedBatchNumber);

    const path = `${sanitizedModuleCode}_${topic.topicName}_${sanitizedBatchNumber}`;
    console.log(path);

    // Set a timeout before saving the cookie
    setTimeout(() => {
      Cookies.set("fileName", `${path}`, { expires: 7 });
      console.log("Cookie saved");
      console.log(Cookies.get("fileName"));

      Cookies.set("topicName", `${topic.topicName}`, { expires: 7 });
      console.log("Cookie saved");
      console.log(Cookies.get("topicName"));

      // Redirect after setting the cookie
      window.location.href = "/preview";
    }, 1000); // 1000 ms = 1 second delay
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
      }}
    >
      {/* Top Navigation Section */}
      <div
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[4],
          paddingBottom: "16px",
        }}
      >
        <ProfileBar teacherId={teacherId} type="teacher" />
        <LogoBar />
        {/* Pass showScheduleButton as true to show the button on this page */}
        <MenuBar showScheduleButton={true} themeMode={themeMode} />
      </div>

      {/* Main Content Area */}
      <Typography
        variant="h4"
        style={{ margin: "24px 0", color: theme.palette.text.primary }}
        className="px-7 font-bold "
      >
        {moduleName}
      </Typography>
      <div className="space-y-4 px-16 py-2">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div
              key={topic.id}
              style={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                padding: "16px",
                boxShadow: theme.shadows[2],
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                transition: "transform 0.3s ease-in-out",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              className="card-hover"
              onClick={() => handleTopicClick(topic)} // Make the div clickable
            >
              {/* Main content - topic name */}
              <Typography
                variant="h6"
                style={{
                  color: theme.palette.text.primary,
                  marginBottom: "0",
                }}
              >
                {topic.topicName}
              </Typography>

              {/* Button on the right side */}
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the div's onClick from firing
                  handleSecondaryAction(topic);
                }}
                variant="outlined"
                color="primary"
                style={{
                  color: theme.palette.primary.main,
                }}
              >
                Preview Page
              </Button>
            </div>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No topics found
          </Typography>
        )}
      </div>
      <div className="p-16"></div>
    </div>
  );
};

export default ModuleDetails;
