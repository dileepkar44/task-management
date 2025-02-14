import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SignInForm } from "./components/auth/SignInForm";
import { SignUpForm } from "./components/auth/SignUpForm";
import { TaskBoard } from "./components/tasks/TaskBoard";
import { Layout } from "./components/layout/Layout";
import { Spinner } from "./components/ui/spinner";
import useAuthStore from "./store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const { init } = useAuthStore();

  useEffect(() => {
    const unsubscribe = init();
    return () => unsubscribe();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<PublicRoute><SignInForm /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUpForm /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><TaskBoard /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
