interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

export default function Button({
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{ cursor: "pointer" }}
      className={`px-6 py-2 bg-blue-800 text-white rounded-full text-lg font-bold border border-2 border-gray-200 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
