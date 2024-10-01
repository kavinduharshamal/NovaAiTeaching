import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileBar from "./ProfileBar";
import LogoBar from "./LogoBar";
import MenuBar from "./MenuBar";

export const ModuleDetails = () => {
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
    window.location.href = `/${path}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <ProfileBar teacherId={teacherId} type="teacher" />
      <LogoBar />
      {/* Pass showScheduleButton as true to show the button on this page */}
      <MenuBar showScheduleButton={true} />
      <h1 className="text-3xl font-bold m-6">{moduleName}</h1>
      <div className="space-y-4">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm max-w-5xl"
            >
              {/* Add a button to trigger an action */}
              <button
                onClick={() => handleTopicClick(topic)}
                className="text-black font-medium hover:underline focus:outline-none bg-gray-100 p-2 rounded"
              >
                {topic.topicName}
              </button>
            </div>
          ))
        ) : (
          <div>No topics found</div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetails;
