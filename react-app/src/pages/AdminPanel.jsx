import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../auth/AuthProvider";
import { db } from "../firebase";
import { VerificationCard } from "../components/VerificationCard";
import { Badge } from "../components/ui/Badge";

export const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(
      collection(db, "verificationRequests"),
      where("status", "==", "pending"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVerificationRequests(requests);
      setLoading(false);
    });

    return unsubscribe;
  }, [isAdmin]);

  const handleApprove = async (requestId, userId) => {
    try {
      // Update verification request
      await updateDoc(doc(db, "verificationRequests", requestId), {
        status: "approved",
        processedAt: serverTimestamp(),
      });

      // Update user document
      await updateDoc(doc(db, "users", userId), {
        verificationStatus: "verified",
        verifiedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReject = async (requestId, userId, rejectionReason) => {
    try {
      // Update verification request
      await updateDoc(doc(db, "verificationRequests", requestId), {
        status: "rejected",
        adminComment: rejectionReason,
        processedAt: serverTimestamp(),
      });

      // Update user document
      await updateDoc(doc(db, "users", userId), {
        verificationStatus: "rejected",
        rejectionReason: rejectionReason,
        rejectedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-100">
            You don't have admin privileges to access this panel.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-100">Loading verification requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-400">TrueConnect</h1>
              <Badge variant="info" size="lg">
                Admin Portal
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {verificationRequests.length}
              </div>
              <div className="text-sm text-gray-100">Pending Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 text-white">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Identity Verification Queue
          </h2>
          <p className="text-gray-100">
            Review user submissions for platform access
          </p>
        </div>

        {verificationRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              All caught up!
            </h3>
            <p className="text-gray-100">
              No pending verification requests at the moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {verificationRequests.map((request) => (
              <VerificationCard
                key={request.id}
                request={request}
                onApprove={() => handleApprove(request.id, request.userId)}
                onReject={(rejectionReason) =>
                  handleReject(request.id, request.userId, rejectionReason)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
