import { Loader } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80"
      role="alert"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
        <p className="text-sm text-gray-500">
          Please wait while we load your content
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
