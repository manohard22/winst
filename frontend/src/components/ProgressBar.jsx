import React from "react";

const ProgressBar = ({
  progress = 0,
  className = "",
  showLabel = false,
  color = "blue",
  size = "default",
}) => {
  const getColorClasses = () => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-500";
      case "purple":
        return "bg-purple-500";
      case "indigo":
        return "bg-indigo-500";
      default:
        return "bg-blue-500";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-1";
      case "large":
        return "h-4";
      default:
        return "h-2";
    }
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeClasses()}`}
      >
        <div
          className={`${getColorClasses()} ${getSizeClasses()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
