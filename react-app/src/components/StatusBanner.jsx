import { Badge } from "./ui/Badge";

const statusConfig = {
  new: {
    icon: "🆔",
    variant: "info",
    bgColor:
      "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
  },
  pending: {
    icon: "⏳",
    variant: "warning",
    bgColor:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
  },
  verified: {
    icon: "✅",
    variant: "success",
    bgColor:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
  },
  rejected: {
    icon: "⚠️",
    variant: "error",
    bgColor: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  },
};

export const StatusBanner = ({ status, rejectionReason, inline = false }) => {
  if (!status || status === "new") {
    const config = statusConfig.new;
    return (
      <div
        className={`rounded-xl border p-4 ${config.bgColor} ${inline ? "mb-4" : "mb-6"}`}
      >
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{config.icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {inline ? "Ready to get verified?" : "Ready to join TrueConnect?"}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {inline
                ? "Upload your government ID below"
                : "Upload your government ID to unlock access to our verified community."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    const config = statusConfig.pending;
    return (
      <div
        className={`rounded-xl border p-4 ${config.bgColor} ${inline ? "mb-4" : "mb-6"}`}
      >
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{config.icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Verification Under Review
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {inline
                ? "Your submission is being reviewed"
                : "Our team is reviewing your submission. You'll receive an update within 24 hours."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "verified") {
    const config = statusConfig.verified;
    return (
      <div
        className={`rounded-xl border p-4 ${config.bgColor} ${inline ? "mb-4" : "mb-6"}`}
      >
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{config.icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Verification Complete!
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {inline
                ? "You're verified!"
                : "Welcome to TrueConnect! You're now part of our verified community."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    const config = statusConfig.rejected;
    return (
      <div
        className={`rounded-xl border p-4 ${config.bgColor} ${inline ? "mb-4" : "mb-6"}`}
      >
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{config.icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {inline ? "Try Again" : "Verification Needs Attention"}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <strong>Issue:</strong>{" "}
              {rejectionReason || "Unable to verify your document."}
            </p>
            {!inline && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Please upload a clearer image and try again.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
