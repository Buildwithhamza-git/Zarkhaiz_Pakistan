import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = forwardRef(({
  label = "Password",
  name,
  value,
  onChange,
  onBlur,
  placeholder = "Enter your password",
  error = "",
  required = false,
  disabled = false,
  autoComplete = "current-password",
  className = "",
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      

      {/* Input */}
      <div className="relative">
        {/* Left Icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock size={18} />
        </span>

        <input
          ref={ref}
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full
            rounded-lg
            border
            bg-white
            py-3
            pl-10
            pr-12
            text-sm
            text-gray-700
            outline-none
            transition-all
            duration-200
            placeholder:text-gray-400

            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200"
            }

            ${
              disabled
                ? "cursor-not-allowed bg-gray-100 text-gray-500"
                : ""
            }

            ${className}
          `}
          {...props}
        />

        {/* Toggle Password */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-green-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;