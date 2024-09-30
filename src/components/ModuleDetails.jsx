import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileBar from "./ProfileBar";
import LogoBar from "./LogoBar";
import MenuBar from "./MenuBar";

export const ModuleDetails = () => {
  // Define the model inside the component
  class TopicModel {
    constructor(id, moduleId, topicName, url1) {
      this.id = id;
      this.moduleId = moduleId;
      this.topicName = topicName;
      this.url1 = url1; // Assuming only one URL for the topic name
    }

    // Static method to map raw API data to an instance of TopicModel
    static fromApi(data) {
      return new TopicModel(data.id, data.moduleId, data.topicName, data.url1);
    }
  }

  const { teacherId, moduleId } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleName, setModuleName] = useState("");

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await axios.get(
          `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/GetTopicsByModuleId/${moduleId}`
        );

        const ModuleName = await axios.get(
          `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Module/${moduleId}`
        );
        setModuleName(ModuleName.data.moduleName);

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
              {/* Make the topic name clickable */}
              <h2 className="text-m font-medium mb-2">
                <a
                  href={topic.url1 || "#"} // Link to the first URL or a default link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  {topic.topicName}
                </a>
              </h2>
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
