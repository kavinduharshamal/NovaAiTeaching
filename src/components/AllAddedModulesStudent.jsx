import React, { useState, useEffect } from "react";
import axios from "axios";
import img1 from "/texture/img_1.png";
import img2 from "/texture/img_2.png";
import img3 from "/texture/img_3.png";
import img4 from "/texture/img_4.png";
import img5 from "/texture/img_5.png";
import Cookies from "js-cookie";

const AllAddedModulesStudent = ({ themeMode }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const batchIdFromCookies = Cookies.get("batchId");

  const randomImages = [img1, img2, img3, img4, img5];
  const apiUrl = `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Module`;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.data && response.data.$values) {
          const modulesData = response.data.$values;

          setModules(modulesData);
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError("No Modules have been added.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Filter modules based on the batch ID from cookies
  const filteredModules = modules.filter((module) =>
    String(module.batchNumber).startsWith(batchIdFromCookies)
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full px-6 mt-6">
      {/* Title */}
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold ${
            themeMode === "dark" ? "text-white" : "text-black-900"
          }`}
        >
          All Added Modules
        </h2>
      </div>

      {/* Render filtered modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredModules.map((module, index) => (
          <div
            key={module.id}
            className={`shadow-lg rounded-lg overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl ${
              themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white"
            }`}
            onClick={() =>
              (window.location.href = `/GetTopicsByModuleId/${1}/${module.id}`)
            }
          >
            <img
              src={randomImages[index % randomImages.length]}
              alt={`Module ${module.moduleName}`}
              className="w-full h-32 object-cover"
            />
            <div
              className={`p-2 ${
                themeMode === "dark"
                  ? "bg-[#0F4F60] text-white"
                  : "bg-[#0F4F60] text-white"
              }`}
            >
              <div className="text-sm">
                <div className="b text-start font-bold">
                  Batch {module.batchNumber}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div
                className={`text-m font-semibold mb-2 flex ${
                  themeMode === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                <span>{module.moduleCode}</span>
                <span className="ml-2"> - {module.moduleName}</span>
              </div>
              <div
                className={`text-sm mt-2 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
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

export default AllAddedModulesStudent;
