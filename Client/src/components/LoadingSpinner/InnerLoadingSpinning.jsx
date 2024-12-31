import { Loader } from "lucide-react";
import PropTypes from "prop-types";

const InlineSpinner = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div
      className="flex items-center gap-2"
      role="alert"
      aria-busy="true"
      aria-label={text}
    >
      <Loader className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};

InlineSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "default", "large"]),
  text: PropTypes.string,
};

export default InlineSpinner;
