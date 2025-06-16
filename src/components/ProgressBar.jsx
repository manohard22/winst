import React from "react";

const ProgressBar = ({
  progress,
  total = 100,
  showLabel = true,
  color = "lucro-blue",
  size = "md",
  className = "",
}) => {
  const percentage = Math.min(Math.max((progress / total) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    "lucro-blue": "bg-lucro-blue",
    "lucro-green": "bg-lucro-green",
    "lucro-orange": "bg-lucro-orange",
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
