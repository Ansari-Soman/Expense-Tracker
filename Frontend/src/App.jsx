import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Diagnostics from "./pages/Dashboard/Diagnostics";
import UserProvider, { UserContext } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Root />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signUp" element={<SignUp />}></Route>
              <Route path="/verify-otp" element={<VerifyOtp />}></Route>
              <Route path="/forgot-password" element={<ForgotPassword />}></Route>
              <Route path="/reset-password" element={<ResetPassword />}></Route>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/income"
                element={
                  <ProtectedRoute>
                    <Income />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/expense"
                element={
                  <ProtectedRoute>
                    <Expense />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/diagnostics"
                element={
                  <ProtectedRoute>
                    <Diagnostics />
                  </ProtectedRoute>
                }
              ></Route>
            </Routes>
          </Router>
        </div>
        <Toaster
          toastOption={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { loading } = useContext(UserContext);
  const isAuthenticated = !!localStorage.getItem("token");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="relative w-16 h-16">
          {/* Spinner Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-100/50 dark:border-purple-950/50 animate-pulse"></div>
          {/* Spinner Active Arc */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">
          Securing your session...
        </p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const Root = () => {
  // Check if token exist in localstorage
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
