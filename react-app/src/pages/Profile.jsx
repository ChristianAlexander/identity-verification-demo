import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../auth/AuthProvider";
import { db, storage } from "../firebase";
import { FileDropzone } from "../components/FileDropzone";
import { StatusBanner } from "../components/StatusBanner";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export const Profile = () => {
  const { user, userDoc } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [currentUserDoc, setCurrentUserDoc] = useState(userDoc);

  // Listen for real-time updates to user document
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setCurrentUserDoc(doc.data());
      }
    });

    return unsubscribe;
  }, [user?.uid]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setMessage(`File selected: ${file.name}`);
  };

  const handleSubmitVerification = async () => {
    if (!selectedFile) {
      setMessage("Please select an ID file first!");
      return;
    }

    setUploading(true);
    setMessage("Uploading your ID document...");

    try {
      // Upload to Firebase Storage with VULNERABLE rules
      const fileRef = ref(
        storage,
        `id-documents/${user.uid}/${selectedFile.name}`,
      );
      await uploadBytes(fileRef, selectedFile);
      const downloadURL = await getDownloadURL(fileRef);

      // Create verification request
      await addDoc(collection(db, "verificationRequests"), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        idImageUrl: downloadURL,
        fileName: selectedFile.name,
        status: "pending",
        submittedAt: serverTimestamp(),
      });

      // Update user status
      await updateDoc(doc(db, "users", user.uid), {
        verificationStatus: "pending",
        idImageUrl: downloadURL,
        lastSubmittedAt: serverTimestamp(),
      });

      setMessage("ID submitted for verification!");
      setSelectedFile(null);
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const canUpload =
    !currentUserDoc ||
    currentUserDoc.verificationStatus === "new" ||
    currentUserDoc.verificationStatus === "rejected";

  if (currentUserDoc?.verificationStatus === "verified") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              TrueConnect
            </h1>
            <span className="text-gray-600 dark:text-gray-400">
              Where every voice is verified
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-12">
            {/* Welcome Hero */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-brand-500 to-sky-500 text-white rounded-2xl p-12 mb-8">
                <div className="text-5xl mb-4">✓</div>
                <h2 className="text-3xl font-bold mb-4">
                  Welcome to TrueConnect!
                </h2>
                <p className="text-xl opacity-90">
                  You're now part of a verified community where every person is
                  real.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card hover className="text-center">
                <CardContent className="py-8">
                  <div className="text-4xl mb-4">🗣️</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Authentic Conversations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connect with real people, no bots or fake accounts
                  </p>
                </CardContent>
              </Card>

              <Card hover className="text-center">
                <CardContent className="py-8">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Trust & Safety
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Every member is identity-verified for your peace of mind
                  </p>
                </CardContent>
              </Card>

              <Card hover className="text-center">
                <CardContent className="py-8">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Premium Experience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Join exclusive verified-only communities and events
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Start Connecting</Button>
              <Button variant="secondary" size="lg">
                Explore Communities
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            TrueConnect
          </h1>
          <span className="text-gray-600 dark:text-gray-400">
            Where every voice is verified
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="lg:grid lg:grid-cols-[2fr_1fr] gap-12 lg:items-start">
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center lg:text-left">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Verification Required
              </h2>
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
                TrueConnect is a verified-humans-only platform. Complete
                identity verification to join our authentic community.
              </p>
            </div>

            {canUpload && (
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Upload Government ID
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      We use bank-level security to verify your identity. Your
                      ID is encrypted and only used for verification.
                    </p>

                    <StatusBanner
                      status={currentUserDoc?.verificationStatus}
                      rejectionReason={currentUserDoc?.rejectionReason}
                      inline={true}
                    />

                    {message && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200">
                        {message}
                      </div>
                    )}

                    <FileDropzone onFileSelect={handleFileSelect} />

                    {selectedFile && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {selectedFile.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <Button
                        onClick={handleSubmitVerification}
                        disabled={!selectedFile || uploading}
                        loading={uploading}
                        fullWidth
                        size="lg"
                      >
                        {uploading ? "Verifying..." : "Complete Verification"}
                      </Button>
                    </div>

                    <div className="mt-4 text-center">
                      <small className="text-gray-500 dark:text-gray-400">
                        🔒 Your information is encrypted and secure. We never
                        store your ID permanently.
                      </small>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentUserDoc?.verificationStatus === "pending" && !canUpload && (
              <div>
                <StatusBanner
                  status={currentUserDoc?.verificationStatus}
                  rejectionReason={currentUserDoc?.rejectionReason}
                />
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">⏳</div>
                    <p className="text-base font-medium text-gray-900 dark:text-white mb-2">
                      Your verification is being reviewed
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We typically review submissions within 24 hours
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="mt-8 lg:mt-0">
            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  What you'll get access to:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">👥</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Connect with verified professionals
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">💬</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Join authentic discussion groups
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🎯</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Access exclusive verified-only content
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🚫</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Zero tolerance for fake accounts
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
