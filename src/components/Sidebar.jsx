// Sidebar.jsx

import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Users,
  LogOut,
  ChevronDown,
  Plus,
  Hash,
  Lock,
  MessageCircle,
} from "lucide-react";

import { logout } from "../redux/slices/authSlice.js";
import { openModal, setSidebarOpen } from "../redux/slices/uiSlice.js";
import { selectChannel, setChannels } from "../redux/slices/channelsSlice.js";
import { tokenService } from "../services/tokenService.js";
import chatApi from "../api/chatApi.js";
import { setGroups } from "../redux/slices/groupsSlice.js";
import { setPersonals } from "../redux/slices/personalSlice.js";

export default function Sidebar({ isOpen }) {
  const [orgData, setOrgData] = useState(null);

  /**
   * CHAT GROUP STATES
   */
  // const [chatGroups, setChatGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  /**
   * SHOW MORE STATES
   */
  const [channelLimit, setChannelLimit] = useState(5);
  const [groupLimit, setGroupLimit] = useState(5);
  const [personalLimit, setPersonalLimit] = useState(5);

  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const user = useSelector((state) => state.auth.user);
  const channels = useSelector((state) => state.channels.channels || []);

  const groups = useSelector((state) => state.groups.groups || []);
  const personal = useSelector((state) => state.personal.personals || []);

  const organization = useSelector((state) => state.auth.organization);
  /**
   * FETCH ORGANIZATION
   */
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
        console.log(err);
      }
    };

    fetchOrgDetails();
  }, []);

  /**
   * FETCH CHAT GROUPS
   */
  useEffect(() => {
    const fetchChatGroups = async () => {
      try {
        setLoadingGroups(true);

        // const accessToken = tokenService.getAccessToken();

        const { data } = await chatApi.get("/chat-group");
        const allGroups = data?.data;
        dispatch(
          setChannels(allGroups.filter((item) => item.groupType === "channel")),
        );
        dispatch(
          setGroups(allGroups.filter((item) => item.groupType === "group")),
        );
        dispatch(
          setPersonals(
            allGroups.filter((item) => item.groupType === "personal"),
          ),
        );
        // setChatGroups(data?.data || []);
      } catch (error) {
        console.log("GET CHAT GROUP ERROR", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchChatGroups();
  }, [dispatch]);

  /**
   * FILTER GROUPS
   */
  // const channels = useMemo(() => {
  //   return chatGroups.filter((item) => item.groupType === "channel");
  // }, [chatGroups]);

  // const groups = useMemo(() => {
  //   return chatGroups.filter((item) => item.groupType === "group");
  // }, [chatGroups]);

  // const personalChats = useMemo(() => {
  //   return chatGroups.filter((item) => item.groupType === "personal");
  // }, [chatGroups]);

  /**
   * ACTIVE MENU
   */
  const isSidebarMenuActive = (path) => {
    if (path === "/dashboard") {
      return currentPath === "/dashboard";
    }

    return currentPath.startsWith(path);
  };

  /**
   * ACTIVE CHAT
   */
  const isChatActive = (groupId) => {
    return currentPath === `/dashboard/chat/${groupId}`;
  };

  /**
   * NAVIGATE
   */
  const handleNavigate = (path) => {
    navigate(path);
  };

  /**
   * OPEN CHAT
   */
  const handleOpenChat = (group) => {
    dispatch(selectChannel(group.groupId));

    navigate(`/dashboard/chat/${group.groupId}`);
  };

  /**
   * LOGOUT
   */
  const handleLogout = () => {
    tokenService.clearTokens();

    dispatch(logout());

    navigate("/login");
  };

  return (
    <>
      {/* MOBILE OVERLAY */}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* SIDEBAR */}

      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transform transition-transform duration-300 z-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* HEADER */}

        <div className="p-4 border-b border-gray-700 relative">
          <div className="flex items-center gap-3">
            {orgData?.logo ? (
              <img
                src={orgData.logo}
                alt={orgData.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center font-bold">
                {orgData?.name?.charAt(0) || "D"}
              </div>
            )}

            <div className="min-w-0">
              <h1 className="font-bold text-sm truncate">
                {orgData?.name || "Workspace"}
              </h1>

              <p className="text-xs text-gray-400 truncate">
                {orgData?.domain}
              </p>
            </div>

            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="ml-auto p-1 hover:bg-gray-700 rounded"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* DROPDOWN */}

          {showOrgDropdown && (
            <div className="absolute top-full right-4 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-xl p-4 z-50 shadow-xl">
              <p className="text-xs text-gray-400 mb-2">Organization Details</p>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Name:</span> {orgData?.name}
                </p>

                <p>
                  <span className="text-gray-400">Domain:</span>{" "}
                  {orgData?.domain}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BODY */}

        <div className="flex-1 overflow-y-auto">
          {/* MENU */}

          <div className="px-4 py-4">
            <button
              onClick={() => handleNavigate("/dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-2 ${
                isSidebarMenuActive("/dashboard")
                  ? "bg-purple-600"
                  : "hover:bg-gray-700"
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>

            <button
              onClick={() => handleNavigate("/dashboard/users")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                isSidebarMenuActive("/dashboard/users")
                  ? "bg-purple-600"
                  : "hover:bg-gray-700"
              }`}
            >
              <Users className="w-5 h-5" />
              Users
            </button>
          </div>

          {/* CHANNELS */}

          <div className="mt-2">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-xs uppercase text-gray-400 font-semibold">
                Channels
              </h3>

              <button
                onClick={() =>
                  dispatch(
                    openModal({
                      modal: "createChannel",
                      meta: {
                        groupType: "channel",
                      },
                    }),
                  )
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 px-2">
              {channels.slice(0, channelLimit).map((channel) => (
                <button
                  key={channel.groupId}
                  onClick={() => handleOpenChat(channel)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
                    isChatActive(channel.groupId)
                      ? "bg-purple-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {channel.privacyType === "private" ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}

                  <span className="truncate">{channel.name}</span>
                </button>
              ))}

              {channels.length > channelLimit && (
                <button
                  onClick={() => setChannelLimit((prev) => prev + 5)}
                  className="text-xs text-purple-300 px-3 py-1 hover:text-white"
                >
                  Show More
                </button>
              )}
            </div>
          </div>

          {/* GROUPS */}

          <div className="mt-4">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-xs uppercase text-gray-400 font-semibold">
                Groups
              </h3>

              <button
                onClick={() =>
                  dispatch(
                    openModal({
                      modal: "createChannel",
                      meta: {
                        groupType: "group",
                      },
                    }),
                  )
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 px-2">
              {groups.slice(0, groupLimit).map((group) => (
                <button
                  key={group.groupId}
                  onClick={() => handleOpenChat(group)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
                    isChatActive(group.groupId)
                      ? "bg-purple-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <Users className="w-4 h-4" />

                  <span className="truncate">{group.name}</span>
                </button>
              ))}

              {groups.length > groupLimit && (
                <button
                  onClick={() => setGroupLimit((prev) => prev + 5)}
                  className="text-xs text-purple-300 px-3 py-1 hover:text-white"
                >
                  Show More
                </button>
              )}
            </div>
          </div>

          {/* DIRECT MESSAGES */}

          <div className="mt-4">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-xs uppercase text-gray-400 font-semibold">
                Direct Messages
              </h3>

              <button
                onClick={() =>
                  dispatch(
                    openModal({
                      modal: "createChannel",
                      meta: {
                        groupType: "personal",
                      },
                    }),
                  )
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 px-2">
              {personal.slice(0, personalLimit).map((chat) => (
                <button
                  key={chat.groupId}
                  onClick={() => handleOpenChat(chat)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
                    isChatActive(chat.groupId)
                      ? "bg-purple-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />

                  <span className="truncate">{chat.name}</span>
                </button>
              ))}

              {personal.length > personalLimit && (
                <button
                  onClick={() => setPersonalLimit((prev) => prev + 5)}
                  className="text-xs text-purple-300 px-3 py-1 hover:text-white"
                >
                  Show More
                </button>
              )}
            </div>
          </div>

          {/* LOADING */}

          {loadingGroups && (
            <div className="text-center text-sm text-gray-400 py-4">
              Loading chats...
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          <div className="flex items-center gap-3 mt-4 border-t border-gray-700 pt-4">
            <img
              src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
              alt={user?.name}
              className="w-9 h-9 rounded-full"
            />

            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>

              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
