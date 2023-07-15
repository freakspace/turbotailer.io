import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ error, ...props }, ref) => {
    const errorStyle = error ? "border-red-600" : "border-gray-200";
    return (
      <div className="">
        <input
          className={
            "w-full text-sm md:text-lg py-3 px-2 rounded-md border border-2 border-solid focus:border-2 focus:border-pink-600 focus:outline-none " +
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
