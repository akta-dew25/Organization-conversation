import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  setAuthChecked,
} from "./redux/slices/authSlice.js";
import {
  setOnlineUsers,
  userOnline,
  userOffline,
} from "./redux/slices/presenceSlice.js";
import { tokenService } from "./services/tokenService.js";
import chatApi from "./api/chatApi.js";
import { setChannels } from "./redux/slices/channelsSlice.js";
import { setGroups } from "./redux/slices/groupsSlice.js";
import { setPersonals } from "./redux/slices/personalSlice.js";

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

  useEffect(() => {
    console.log({ isAuthenticated, user });
    if (isAuthenticated && user?.id) {
      console.log({ user });
      socket.auth = {
        userId: user.id,
        userName: user.name,
        orgId: user.orgId,
      };

      socket.connect();

      const handleActiveUsers = (users) => {
        dispatch(setOnlineUsers(users || []));
      };

      const handleUserOnline = (onlineUser) => {
        dispatch(userOnline(onlineUser));
      };

      const handleUserOffline = (offlineUser) => {
        dispatch(userOffline(offlineUser));
      };

      const handleUserDeleted = async ({ userId }) => {
        try {
          const { data } = await chatApi.get("/chat-group");
          const allGroups = data?.data || [];
          dispatch(
            setChannels(
              allGroups.filter((item) => item.groupType === "channel"),
            ),
          );
          dispatch(
            setGroups(allGroups.filter((item) => item.groupType === "group")),
          );

          const personals = allGroups.filter(
            (item) => item.groupType === "personal",
          );
          const filteredPersonals = personals.filter((p) => {
            const members = p.members || [];
            return !members.some(
              (m) => String(m.userId || m.id || m._id) === String(userId),
            );
          });
          dispatch(setPersonals(filteredPersonals));
        } catch (err) {
          console.log("Failed to refresh chat groups after user-deleted", err);
        }
      };

      socket.on("active-users", handleActiveUsers);
      socket.on("activeUsers", handleActiveUsers);
      socket.on("user-online", handleUserOnline);
      socket.on("userOnline", handleUserOnline);
      socket.on("user-offline", handleUserOffline);
      socket.on("user-deleted", handleUserDeleted);
      socket.on("userDeleted", handleUserDeleted);
      socket.on("userOffline", handleUserOffline);

      return () => {
        socket.off("active-users", handleActiveUsers);
        socket.off("activeUsers", handleActiveUsers);
        socket.off("user-online", handleUserOnline);
        socket.off("userOnline", handleUserOnline);
        socket.off("user-offline", handleUserOffline);
        socket.off("userOffline", handleUserOffline);
        socket.off("user-deleted", handleUserDeleted);
        socket.off("userDeleted", handleUserDeleted);
        socket.disconnect();
      };
    }

    return () => {
      socket.disconnect();
    };
  }, [dispatch, isAuthenticated, user]);
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
