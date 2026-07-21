import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;