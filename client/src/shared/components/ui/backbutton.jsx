import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({
  text = "Back",
  to,
  variant = "ghost",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const variants = {
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100",

    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",

    primary:
      "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`
        inline-flex
        items-center
        gap-2
        rounded-lg
        px-4
        py-2
        text-sm
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-green-500
        ${variants[variant]}
        ${className}
      `}
    >
      <ArrowLeft size={18} />
      {text}
    </button>
  );
};

export default BackButton;