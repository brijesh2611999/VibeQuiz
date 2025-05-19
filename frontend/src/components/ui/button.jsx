export function Button({ children, onClick, variant = "solid", className }) {
  const baseClasses = "py-2 px-4 rounded font-semibold focus:outline-none transition";

  const variants = {
    solid: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-100",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
