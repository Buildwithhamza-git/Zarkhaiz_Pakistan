import React, { forwardRef, useId } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      onBlur,
      placeholder = "",
      error = "",
      required = false,
      disabled = false,
      readOnly = false,
      autoComplete = "off",
      leftIcon,
      rightIcon,
      className = "",
      ...props
    },
    ref
  ) => {
    const id = useId();

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}

          {/* Input */}
          <input
            id={id}
            ref={ref}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete={autoComplete}
            className={`
              w-full
              rounded-lg
              border
              bg-white
              py-3
              text-sm
              text-gray-700
              outline-none
              transition-all
              duration-200
              placeholder:text-gray-400

              ${leftIcon ? "pl-10" : "pl-4"}
              ${rightIcon ? "pr-10" : "pr-4"}

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

          {/* Right Icon */}
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;