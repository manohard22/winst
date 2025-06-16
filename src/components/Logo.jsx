import React from "react";

const Logo = ({ className = "h-8 w-8" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="6" fill="#2557a7" />
      <path d="M8 24V8h3v13h6v3H8z" fill="white" />
      <path
        d="M18 16v8h3v-5.5c0-1.38 1.12-2.5 2.5-2.5S26 17.12 26 18.5V24h3v-5.5c0-3.03-2.47-5.5-5.5-5.5S18 15.47 18 16z"
        fill="white"
      />
    </svg>
  );
};

export default Logo;
