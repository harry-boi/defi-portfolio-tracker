import React from "react";

const MetricCard = ({ icon, label, value, change, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      <div
        className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-2`}
      >
        {icon}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div
        className={`text-sm ${
          change.startsWith("+") ? "text-green-600" : "text-red-600"
        }`}
      >
        {change}
      </div>
    </div>
  );
};

export default MetricCard;
