import React from "react";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="h-12 w-12 text-gray-400" />
        </div>
      )}

      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      )}

      {description && (
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      )}

      {action && action}
    </div>
  );
};

export default EmptyState;
