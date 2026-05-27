import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout } from "./redux/slices/authSlice.js";
import { tokenService } from "./services/tokenService.js";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import NotificationCenter from "./components/NotificationCenter.jsx";
import CreateChannelModal from "./components/CreateChannelModal.jsx";
import AddMembersModal from "./components/AddMembersModal.jsx";
import { socket } from "./socket/socket.js";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Restore session from localStorage on app load
  useEffect(() => {
    const initializeAuth = () => {
      const tokens = tokenService.getTokens();
      const user = tokenService.getUser();

      if (tokens?.accessToken && tokens?.refreshToken && user) {
        // Check if access token is not expired
        if (!tokenService.isTokenExpired(tokens.accessToken)) {
          // Restore authenticated session
          dispatch(
            loginSuccess({
              user,
              organization: user.organization || null,
              tokens,
            }),
          );
        } else {
          // Token expired, clear it
          tokenService.clearTokens();
          dispatch(logout());
        }
      }
    };

    initializeAuth();
    const token = tokenService.getAccessToken();

    if (token) {
      const decoded = tokenService.decodeToken(token);

      socket.connect();

      socket.emit("join-user", {
        userId: decoded.userId,
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <NotificationCenter />
      <CreateChannelModal />
      <AddMembersModal />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
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
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
