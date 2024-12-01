import React from "react";

const AssetCard = ({ icon, label, value, change, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Icon and Label */}
        <div
          className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>
      {/* Token Balance */}
      <div className="text-right">
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={`text-sm ${
            change.startsWith("+") ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
