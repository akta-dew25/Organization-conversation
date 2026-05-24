import { useRef, useEffect } from "react";
import { Smile, MoreVertical } from "lucide-react";

export default function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

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
      {messages.map((message, index) => {
        const showAvatar =
          index === 0 || messages[index - 1].sender.id !== message.sender.id;

        return (
          <div key={message.id} className="group">
            <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              {/* Avatar */}
              {showAvatar ? (
                <img
                  src={message.sender.avatar}
                  alt={message.sender.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 flex-shrink-0"></div>
              )}

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                {showAvatar && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="font-semibold text-gray-800">
                      {message.sender.name}
                    </p>
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                )}
                <div className="text-gray-700 break-words">
                  {message.content}
                </div>
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {message.reactions.map((reaction, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100"
                      >
                        {reaction}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="invisible group-hover:visible flex gap-2 flex-shrink-0">
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <Smile className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
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
