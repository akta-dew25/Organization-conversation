import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  setAuthChecked,
} from "./redux/slices/authSlice.js";
import { tokenService } from "./services/tokenService.js";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

import NotificationCenter from "./components/NotificationCenter.jsx";
import CreateChannelModal from "./components/CreateChannelModal.jsx";
import AddMembersModal from "./components/AddMembersModal.jsx";

import { socket } from "./socket/socket.js";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  // Restore session after refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokens = tokenService.getTokens();
        const user = tokenService.getUser();

        // REFRESH TOKEN EXPIRED

        if (tokenService.isTokenExpired(tokens.refreshToken)) {
          tokenService.clearTokens();

          dispatch(logout());

          return;
        }
        if (!tokens?.refreshToken || !user) {
          dispatch(logout());
          return;
        }

        dispatch(
          loginSuccess({
            user,
            organization: user.organization || null,
            tokens,
          }),
        );
      } catch (error) {
        console.log(error);

        dispatch(logout());
      } finally {
        dispatch(setAuthChecked());
      }
    };

    initializeAuth();
  }, [dispatch]);
  if (!isAuthChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <NotificationCenter />
      <CreateChannelModal />
      <AddMembersModal />

      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              user?.isActive === "Invited" ? (
                <Navigate to="/change-password" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <ForgotPasswordPage />
            )
          }
        />

        {/* Change Password */}
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              user?.isActive === "Invited" ? (
                <Navigate to="/change-password" />
              ) : (
                <DashboardLayout />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
