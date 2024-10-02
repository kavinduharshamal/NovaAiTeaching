import React, { useState, useEffect } from "react";
import axios from "axios";
import img1 from "/texture/img_1.png";
import img2 from "/texture/img_2.png";
import img3 from "/texture/img_3.png";
import img4 from "/texture/img_4.png";
import img5 from "/texture/img_5.png";
import Cookies from "js-cookie";

const RecentlyAddedModulesStudent = ({ themeMode }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const randomImages = [img1, img2, img3, img4, img5];
  const apiUrl =
    "https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Module";

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.data && response.data.$values) {
          let filteredModules = response.data.$values;

          // Get the batch ID from cookies and filter the modules
          const batchIdFromCookies = Cookies.get("batchId");
          console.log(batchIdFromCookies);
          if (batchIdFromCookies) {
            filteredModules = filteredModules.filter((module) =>
              String(module.batchNumber).startsWith(batchIdFromCookies)
            );
          }

          // Sort by createdTime in descending order (most recent first)
          filteredModules = filteredModules.sort(
            (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
          );

          // Take the top 5 most recent modules
          setModules(filteredModules.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError("Error fetching modules.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []); // Fetch modules when the component mounts

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full px-6">
      <h2
        className={`text-2xl font-bold mb-6 ${
          themeMode === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Recently Added Modules
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={`shadow-lg rounded-lg overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl ${
              themeMode === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
            onClick={() =>
              (window.location.href = `/GetTopicsByModuleIdStudent/${module.id}`)
            }
          >
            {/* Adding a local image */}
            <img
              src={randomImages[index % randomImages.length]}
              alt={`Module ${module.moduleName}`}
              className="w-full h-32 object-cover"
            />
            <div className="bg-[#0F4F60] text-white p-2">
              <div className="text-sm">
                <div className="font-bold">Batch {module.batchNumber}</div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-m font-semibold mb-2 flex">
                <span>{module.moduleCode}</span>
                <span
                  className={`ml-2 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  - {module.moduleName}
                </span>
              </div>
              <div
                className={`text-sm ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                } mt-2`}
              >
                Semester - {module.semesterNumber}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddedModulesStudent;
