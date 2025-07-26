import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { RequireAuth } from "./components/RequireAuth";
import { NavBar } from "./components/NavBar";
import { SignIn } from "./pages/SignIn";
import { Profile } from "./pages/Profile";
import { AdminPanel } from "./pages/AdminPanel";
import { VulnerabilityDemo } from "./pages/VulnerabilityDemo";

function AppContent() {
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isAdmin]);

  return (
    <div className={`app ${isAdmin ? "admin-mode" : ""}`}>
      <NavBar />

      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/vulnerability" element={<VulnerabilityDemo />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
