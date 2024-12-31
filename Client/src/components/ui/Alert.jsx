import PropTypes from "prop-types";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

const alertStyles = {
  success: "bg-green-100 text-green-800 border-green-500",
  error: "bg-red-100 text-red-800 border-red-500",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
  info: "bg-blue-100 text-blue-800 border-blue-500",
};

const iconMap = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const Alert = ({
  type = "info",
  message,
  onClose,
  className = "",
  showIcon = true,
  showCloseButton = true,
}) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center justify-between p-4 mb-4 border-l-4 rounded ${alertStyles[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {showIcon && iconMap[type]}
        <span className="font-medium">{message}</span>
      </div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center p-1 ml-auto rounded-lg hover:bg-opacity-20 hover:bg-gray-900"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
  showCloseButton: PropTypes.bool,
};

export default Alert;
