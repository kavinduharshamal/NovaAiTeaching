import React, { useState, useEffect } from "react";
import axios from "axios";
import img1 from "/texture/img_1.png";
import img2 from "/texture/img_2.png";
import img3 from "/texture/img_3.png";
import img4 from "/texture/img_4.png";
import img5 from "/texture/img_5.png";

const AllAddedModules = ({
  teacherId,
  themeMode,
  selectedBatch,
  setSelectedBatch, // Now receiving correctly
}) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [batchNumbers, setBatchNumbers] = useState([]);

  const randomImages = [img1, img2, img3, img4, img5];
  const apiUrl = `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/GetModulesWithTopicsByTeacherId/${teacherId}`;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.data && response.data.$values) {
          const modulesData = response.data.$values;

          // Extract unique batch numbers from available modules
          const uniqueBatches = [
            ...new Set(
              modulesData
                .map((module) =>
                  module.batchNumber
                    ? String(module.batchNumber).slice(0, 2)
                    : null
                )
                .filter((batch) => batch !== null)
            ),
          ];
          setBatchNumbers(uniqueBatches);

          setModules(modulesData);
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError("No Modules have been added");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [teacherId]);

  // Filter modules based on the selected batch
  const filteredModules = selectedBatch
    ? modules.filter((module) =>
        String(module.batchNumber).startsWith(selectedBatch)
      )
    : modules;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full px-6 mt-6">
      {/* Title and Dropdown in a flex container */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-bold ${
            themeMode === "dark" ? "text-white" : "text-black-900"
          }`}
        >
          All Added Modules
        </h2>
        {/* Dropdown for selecting Batch */}
        <div className="flex items-center">
          <label
            htmlFor="batchSelect"
            className={`text-sm font-semibold mr-2 ${
              themeMode === "dark" ? "text-white" : "text-black-900"
            }`}
          >
            Select Batch:
          </label>
          <select
            id="batchSelect"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)} // Properly use setSelectedBatch
            className={`p-2 border rounded-md ${
              themeMode === "dark"
                ? "bg-gray-700 text-white"
                : "bg-white text-black"
            }`}
          >
            <option value="">All Batches</option>
            {batchNumbers.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>
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
              (window.location.href = `/GetTopicsByModuleId/${teacherId}/${module.id}`)
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

export default AllAddedModules;
