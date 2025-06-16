import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "lucro-blue",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colorClasses = {
    "lucro-blue": "border-lucro-blue",
    white: "border-white",
    gray: "border-gray-500",
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    ></div>
  );
};

export default LoadingSpinner;
