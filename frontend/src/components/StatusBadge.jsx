import React from "react";

const StatusBadge = ({
  status,
  className = "",
  size = "default",
  variant = "default",
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      // Enrollment statuses
      active: {
        label: "Active",
        classes: "bg-green-100 text-green-800 border-green-200",
        icon: "●",
      },
      completed: {
        label: "Completed",
        classes: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "✓",
      },
      paused: {
        label: "Paused",
        classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏸",
      },
      cancelled: {
        label: "Cancelled",
        classes: "bg-red-100 text-red-800 border-red-200",
        icon: "✕",
      },
      enrolled: {
        label: "Enrolled",
        classes: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: "📚",
      },
      in_progress: {
        label: "In Progress",
        classes: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "⚡",
      },
      // Payment statuses
      paid: {
        label: "Paid",
        classes: "bg-green-100 text-green-800 border-green-200",
        icon: "✓",
      },
      pending: {
        label: "Pending",
        classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳",
      },
      failed: {
        label: "Failed",
        classes: "bg-red-100 text-red-800 border-red-200",
        icon: "✕",
      },
      refunded: {
        label: "Refunded",
        classes: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "↩",
      },
      // Assessment statuses
      passed: {
        label: "Passed",
        classes: "bg-green-100 text-green-800 border-green-200",
        icon: "✓",
      },
      failed_assessment: {
        label: "Failed",
        classes: "bg-red-100 text-red-800 border-red-200",
        icon: "✕",
      },
      // Task statuses
      todo: {
        label: "To Do",
        classes: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "○",
      },
      submitted: {
        label: "Submitted",
        classes: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "📤",
      },
      reviewed: {
        label: "Reviewed",
        classes: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "👁",
      },
    };

    return (
      configs[status] || {
        label: status || "Unknown",
        classes: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "?",
      }
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-2 py-0.5 text-xs";
      case "large":
        return "px-4 py-2 text-sm";
      default:
        return "px-2.5 py-1 text-xs";
    }
  };

  const config = getStatusConfig(status);
  const baseClasses =
    "inline-flex items-center font-medium rounded-full border";
  const sizeClasses = getSizeClasses();
  const colorClasses = className || config.classes;

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {variant === "with-icon" && (
        <span className="mr-1" aria-hidden="true">
          {config.icon}
        </span>
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
