import React, { useState } from "react";
import RecentlyAddedModules from "./RecentlyAddedModules";
import AllAddedModules from "./AllAddedModules";
import RecentlyAddedModulesStudent from "./RecentlyAddedModulesStudent";
import AllAddedModulesStudent from "./AllAddedModulesStudent";

const DashboardModulesStudent = ({ themeMode }) => {
  // Manage shared state for batch selection
  const [selectedBatch, setSelectedBatch] = useState("");

  return (
    <div>
      {/* Recently Added Modules filtered by the selected batch */}
      <div className="mb-4">
        <RecentlyAddedModulesStudent
          themeMode={themeMode}
          selectedBatch={selectedBatch} // Pass down the selected batch to filter recently added modules
        />
      </div>

      {/* Horizontal Divider */}
      <hr
        className={`border-t-1 my-4 w-full ${
          themeMode === "dark" ? "border-white" : "border-[#0F4F60]"
        }`}
      />

      {/* All Added Modules with batch filter dropdown */}
      <div>
        <AllAddedModulesStudent
          teacherId={1}
          themeMode={themeMode}
          selectedBatch={selectedBatch}
          setSelectedBatch={setSelectedBatch} // Pass down batch state and setter
        />
      </div>
    </div>
  );
};

export default DashboardModulesStudent;
