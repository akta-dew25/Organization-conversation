import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Users, Plus, Search } from "lucide-react";
import { selectGroup } from "../redux/slices/groupsSlice.js";
import { openModal } from "../redux/slices/uiSlice.js";
import MessageList from "../components/MessageList.jsx";
import MessageInput from "../components/MessageInput.jsx";

export default function GroupsView() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groups);
  const selectedGroupId = useSelector((state) => state.groups.selectedGroupId);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedGroup =
    groups.find((g) => g.id === selectedGroupId) || groups[0];
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 flex lg:flex-row flex-col">
      {/* Groups Sidebar */}
      <div className="w-full lg:w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" /> Groups
            </h2>
            <button
              onClick={() => dispatch(openModal("createChannel"))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Create group"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base pl-10 text-sm"
            />
          </div>
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          {filteredGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => dispatch(selectGroup(group.id))}
              className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedGroup?.id === group.id
                  ? "bg-purple-50 border-l-4 border-l-primary"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {group.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{group.name}</p>
                  <p className="text-xs text-gray-500">
                    {group.members.length} members
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedGroup ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Group Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                {selectedGroup.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedGroup.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedGroup.members.length} members
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(openModal("addMembers"))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Members */}
          <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-2 overflow-x-auto">
            {selectedGroup.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600">{member.name}</span>
              </div>
            ))}
          </div>

          {/* Messages */}
          <MessageList messages={[]} />

          {/* Input */}
          <MessageInput channelId={selectedGroup.id} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a group to start messaging</p>
        </div>
      )}
    </div>
  );
}
