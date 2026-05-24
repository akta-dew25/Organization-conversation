import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
} from "lucide-react";
import { logout } from "../redux/slices/authSlice.js";
import { openModal, setSidebarOpen } from "../redux/slices/uiSlice.js";
import { selectChannel } from "../redux/slices/channelsSlice.js";
import { tokenService } from "../services/tokenService.js";
import apiClient from "../api/apiClient.js";

export default function Sidebar({ isOpen }) {
  const [orgData, setOrgData] = useState(null);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const organization = useSelector((state) => state.auth.organization);
  const channels = useSelector((state) => state.channels.channels);
  const selectedChannelId = useSelector(
    (state) => state.channels.selectedChannelId,
  );

  // Fetch organization details from API
  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        const accessToken = tokenService.getAccessToken();
        if (!accessToken) return;

        const decodedToken = tokenService.decodeToken(accessToken);
        const orgId = decodedToken?.orgId;

        if (!orgId) return;

        const { data } = await axios.get(
          `http://localhost:5000/api/v1/organization/${orgId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setOrgData(data.org || data);
      } catch (err) {
        console.error("Failed to fetch organization details:", err);
      }
    };

    fetchOrgDetails();
  }, []);

  const handleLogout = () => {
    tokenService.clearTokens();
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigate = (path, id = null) => {
    if (id) {
      dispatch(selectChannel(id));
    }
    navigate(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transform transition-transform duration-300 z-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 relative">
          <div className="flex items-center gap-3 mb-4">
            {orgData?.logo ? (
              <img
                src={orgData.logo}
                alt={orgData.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center font-bold">
                {orgData?.name?.charAt(0) ||
                  organization?.name?.charAt(0) ||
                  "D"}
              </div>
            )}

            <div className="min-w-0">
              <h1 className="font-bold text-sm truncate">
                {orgData?.name || organization?.name || "DevCrew"}
              </h1>
              <p className="text-xs text-gray-400 truncate">
                {orgData?.domain || organization?.slug || "devcrew"}
              </p>
            </div>

            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="ml-auto flex-shrink-0 p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showOrgDropdown ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Organization Dropdown (absolutely positioned so it doesn't push content) */}
          {showOrgDropdown && (
            <div className="absolute right-1 top-full mt-4 mr-4 w-64 p-3 bg-gray-800 rounded-lg border border-gray-600 space-y-2 text-xs z-30 shadow-lg">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">
                  Organization Details
                </p>
              </div>

              <div className="border-t border-gray-600 pt-2">
                <p className="text-gray-300">
                  <span className="text-gray-500">Name:</span>{" "}
                  {orgData?.name || organization?.name || "N/A"}
                </p>
                <p className="text-gray-300 mt-1">
                  <span className="text-gray-500">Domain:</span>{" "}
                  {orgData?.domain || organization?.slug || "N/A"}
                </p>
              </div>

              {orgData?.isActive !== undefined && (
                <div className="border-t border-gray-600 pt-2">
                  <p className="text-gray-300">
                    <span className="text-gray-500">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${orgData?.isActive ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}
                    >
                      {orgData?.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              )}

              {orgData?.createdAt && (
                <div className="border-t border-gray-600 pt-2">
                  <p className="text-gray-300">
                    <span className="text-gray-500">Created:</span>{" "}
                    {new Date(orgData.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Channels Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Access */}
          <div className="px-4 py-4">
            <button
              onClick={() => handleNavigate("/dashboard")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left mb-2"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavigate("/dashboard/direct-messages")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left mb-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Direct Messages</span>
            </button>
            <button
              onClick={() => handleNavigate("/dashboard/users")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left mb-4"
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </button>
          </div>

          {/* Channels */}
          <div>
            <div className="px-4 py-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Channels
              </h3>
              <button
                onClick={() => dispatch(openModal("createChannel"))}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 px-4">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() =>
                    handleNavigate(
                      `/dashboard/channel/${channel.id}`,
                      channel.id,
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${selectedChannelId === channel.id ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}
                >
                  <span className="text-lg">#{channel.icon}</span>
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div>
            <div className="px-4 py-2 mt-4 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Groups
              </h3>
              <button
                onClick={() => dispatch(openModal("createChannel"))}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 px-4">
              <button
                onClick={() => handleNavigate("/dashboard/groups")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left text-gray-300"
              >
                <Users className="w-5 h-5" />
                <span>Browse All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          {/* <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left text-gray-300">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </button> */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-left text-gray-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-3 py-3 mt-4 border-t border-gray-700">
            <img
              src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
