import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import ChannelView from "./ChannelView.jsx";
import DirectMessagesView from "./DirectMessagesView.jsx";
import GroupsView from "./GroupsView.jsx";
import UsersView from "./UsersView.jsx";
import { toggleSidebar, setSidebarOpen } from "../redux/slices/uiSlice.js";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const [activeTab, setActiveTab] = useState("channels");

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        dispatch(setSidebarOpen(true));
      } else {
        dispatch(setSidebarOpen(false));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        dispatch(setSidebarOpen(false));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, sidebarOpen]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={handleToggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Routes */}
          <Routes>
            <Route path="/" element={<ChannelView />} />
            <Route path="/chat/:id" element={<ChannelView />} />
            <Route path="/direct-messages" element={<DirectMessagesView />} />
            <Route path="/groups" element={<GroupsView />} />
            <Route path="/users" element={<UsersView />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
