import React from "react";
import { getStatusColor } from "../utils/helpers";

const StatusBadge = ({ status, className = "" }) => {
  const colorClass = getStatusColor(status);

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      {status.replace("_", " ").replace("-", " ")}
    </span>
  );
};

export default StatusBadge;
