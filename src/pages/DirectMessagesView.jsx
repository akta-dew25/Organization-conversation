import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Search, Users, Check } from "lucide-react";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput.jsx";

export default function DirectMessagesView() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groups);
  const [selectedUser, setSelectedUser] = useState(groups[0] || null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 flex lg:flex-row flex-col">
      {/* Users Sidebar */}
      <div className="w-full lg:w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> Direct Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base pl-10 text-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedUser(group)}
              className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedUser?.id === group.id ? "bg-purple-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                  {group.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{group.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {group.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedUser.name}
                </h3>
                <p className="text-xs text-gray-500">Active 2h ago</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="text-center py-4">
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>

          {/* Input */}
          <MessageInput channelId={selectedUser.id} isDirect={true} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">
            Select a conversation to start messaging
          </p>
        </div>
      )}
    </div>
  );
}
