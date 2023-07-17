import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ error, ...props }, ref) => {
    const errorStyle = error ? "border-red-600" : "border-gray-200";
    return (
      <div className="mb-3">
        <input
          className={
            "w-full text-sm md:text-lg py-2 px-4 rounded-full border border-solid focus:shadow-lg focus:outline-none " +
            errorStyle
          }
          ref={ref}
          {...props}
        />
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
