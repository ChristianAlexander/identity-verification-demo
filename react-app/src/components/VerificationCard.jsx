import { useState } from "react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export const VerificationCard = ({ request, onApprove, onReject }) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    return timestamp.toDate
      ? timestamp.toDate().toLocaleString()
      : new Date(timestamp).toLocaleString();
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason.trim());
      setShowRejectForm(false);
      setRejectionReason("");
    }
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setRejectionReason("");
  };

  return (
    <div className="h-full bg-gray-800 border border-gray-700 text-white rounded-2xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-600">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">
            User Verification
          </h3>
          <Badge variant="info" size="sm">
            #{request.id.slice(-8)}
          </Badge>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium text-gray-100">User:</span>{" "}
            <span className="text-white">{request.userName || "Unknown"}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-100">Email:</span>{" "}
            <span className="text-white">{request.userEmail}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-100">Submitted:</span>{" "}
            <span className="text-white">
              {formatDate(request.submittedAt)}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-100">File:</span>{" "}
            <span className="text-white">{request.fileName}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-white">Submitted Document:</h4>
          <img
            src={request.idImageUrl}
            alt="ID Document"
            className="w-full h-48 object-cover rounded-lg border border-gray-600"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkIGltYWdlPC90ZXh0Pjwvc3ZnPg==";
            }}
          />

          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <h5 className="font-medium text-white mb-3">Review Checklist:</h5>
            <ul className="space-y-2 text-sm text-gray-100">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                Document is clear and readable
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                Photo matches submitted information
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                Document appears authentic
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                All required fields are visible
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-600">
        {!showRejectForm ? (
          <div className="flex space-x-3 w-full">
            <Button onClick={onApprove} variant="primary" className="flex-1">
              ✅ Approve
            </Button>
            <Button
              onClick={() => setShowRejectForm(true)}
              variant="danger"
              className="flex-1"
            >
              ❌ Reject
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">
                Rejection Reason (required)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please specify why this verification was rejected..."
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleReject}
                variant="danger"
                className="flex-1"
                disabled={!rejectionReason.trim()}
              >
                Confirm Reject
              </Button>
              <Button
                onClick={handleCancelReject}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
