const Alert = ({ message, type }) => {
  if (!message) return null;

  const colors = {
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  return (
    <div
      className={`mb-5 p-4 rounded-lg border ${
        colors[type] || colors.error
      }`}
    >
      {message}
    </div>
  );
};

export default Alert;