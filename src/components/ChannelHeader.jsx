import { Info, Users, X } from "lucide-react";
import { useState } from "react";
import { openModal } from "../redux/slices/uiSlice";
import { useDispatch } from "react-redux";

export default function ChannelHeader({ channel, members, refreshGroup }) {
  const dispatch = useDispatch();
  const [showMembers, setShowMembers] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  return (
    <>
      <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {channel.groupType === "channel" || channel.groupType === "group"
              ? "#"
              : ""}
            {channel?.name}
          </h2>
          <p className="text-sm text-gray-500">{channel?.description}</p>
        </div>
        {channel.groupType === "channel" || channel.groupType === "group" ? (
          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                (setShowInfo(false), setShowMembers(true));
              }}
            >
              <Users className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                (setShowInfo(true), setShowMembers(false));
              }}
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* memebrs deatils */}
      {showMembers && (
        <div className="fixed top-0 right-0 w-80 h-screen bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              Members ({members.length})
            </h3>
            <div className="flex items-center gap-2">
              {/* Add Member Button */}
              <button
                onClick={() =>
                  dispatch(
                    openModal({
                      modal: "addMember",
                      meta: {
                        groupId: channel?.groupId,

                        refreshGroup,
                      },
                    }),
                  )
                }
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                +
              </button>

              <button
                onClick={() => setShowMembers(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {members.length === 0 ? (
              <p className="text-sm text-gray-500">No members found</p>
            ) : (
              members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center gap-3 p-3 border rounded-xl"
                >
                  <img
                    src={member?.avatar || "https://i.pravatar.cc/150?img=1"}
                    alt={member?.name}
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{member?.name}</p>

                    <p className="text-xs text-gray-500">{member?.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {showInfo && (
        <div className="fixed top-0 right-0 w-80 h-screen bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Channel Info</h3>

            <button
              onClick={() => setShowInfo(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info Content */}
          <div className="p-4 space-y-5">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Name</p>

              <p className="font-medium text-gray-800">#{channel?.name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">
                Description
              </p>

              <p className="text-sm text-gray-700">
                {channel?.description || "No description"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Group Type</p>

              <p className="text-sm text-gray-700 capitalize">
                {channel?.groupType}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Privacy</p>

              <p className="text-sm text-gray-700 capitalize">
                {channel?.privacyType}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Members</p>

              <p className="text-sm text-gray-700">{channel?.memberCount}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Created At</p>

              <p className="text-sm text-gray-700">
                {new Date(channel?.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
