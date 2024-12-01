import React from "react";

const AssetCard = ({ icon, label, value, change, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md relative flex items-center justify-between dark:text-white">
      <div className="flex items-center space-x-4">
        <div
          className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </div>
        </div>
      </div>
      {/* Token Balance */}
      <div className="text-right">
        <div className="text-lg font-semibold dark:text-gray-300">{value}</div>
        <div
          className={`text-sm ${
            change.startsWith("+")
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {change}
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
