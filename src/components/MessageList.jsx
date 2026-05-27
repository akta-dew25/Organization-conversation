import { useRef, useEffect } from "react";
import { Smile, MoreVertical } from "lucide-react";
import tokenService from "../services/tokenService";

export default function MessageList({ messages }) {
  const messagesEndRef = useRef(null);
  const accessToken = tokenService.getAccessToken();

  const decodedUser = tokenService.decodeToken(accessToken);

  const currentUserId = decodedUser?.userId;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No messages yet</p>
          <p className="text-sm text-gray-400">
            Start a conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
      {messages.map((message) => {
        const isSender = String(message.senderId) === String(currentUserId);

        return (
          <div
            key={message._id}
            className={`flex ${isSender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] flex gap-2 group ${
                isSender ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* AVATAR */}
              <img
                src="https://i.pravatar.cc/150?img=3"
                alt="user"
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />

              {/* MESSAGE BOX */}
              <div>
                {/* NAME + TIME */}
                <div
                  className={`flex items-center gap-2 mb-1 ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-700">
                    {isSender ? "You" : "User"}
                  </p>

                  <span className="text-[11px] text-gray-400">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* MESSAGE */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm break-words shadow-sm ${
                    isSender
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {message.messageType === "file" ? (
                    <div className="flex items-center gap-2">
                      <span>📎</span>
                      <span>{message.message}</span>
                    </div>
                  ) : (
                    message.message
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="invisible group-hover:visible flex items-start gap-1 mt-1">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Smile className="w-4 h-4 text-gray-500" />
                </button>

                <button className="p-1 hover:bg-gray-200 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
