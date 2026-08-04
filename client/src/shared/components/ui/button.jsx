
const variants = {
  primary:
    "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",

  secondary:
    "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",

  outline:
    "border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",

  warning:
    "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",

  ghost:
    "text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
};

const sizes = {
  sm: "px-3 py-2 text-sm",

  md: "px-5 py-2.5 text-base",

  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-60

        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />

            <path
              fill="currentColor"
              className="opacity-75"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}

          <span>{children}</span>

          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
