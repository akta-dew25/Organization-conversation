import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Paperclip, Smile, Plus } from "lucide-react";
import { addMessage } from "../redux/slices/messagesSlice.js";

export default function MessageInput({ channelId, isDirect = false }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      channelId,
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      content: message,
      timestamp: new Date(),
      reactions: [],
      replies: 0,
    };

    dispatch(addMessage({ channelId, message: newMessage }));
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="border-t border-gray-200 px-6 py-4 bg-white"
    >
      {/* Message Input */}
      <div className="flex items-end gap-3">
        {/* Attachments */}
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>

        {/* Input Field */}
        <div className="flex-1 flex items-end gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message #channel..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows="1"
          />
        </div>

        {/* Emoji */}
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Smile className="w-5 h-5 text-gray-600" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Formatting Hint */}
      <p className="text-xs text-gray-400 mt-2">
        Use <code className="bg-gray-100 px-1 py-0.5 rounded">Shift+Enter</code>{" "}
        for new line
      </p>
    </form>
  );
}
