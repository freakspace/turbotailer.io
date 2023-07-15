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
      className={`bg-pink-600 hover:bg-pink-500 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg border border-solid border-gray-300 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
