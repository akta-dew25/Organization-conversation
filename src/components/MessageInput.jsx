import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Send, Paperclip, Smile } from "lucide-react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import chatApi from "../api/chatApi";
import { socket } from "../socket/socket.js";

export default function MessageInput({ channelId, refreshGroup }) {
  const user = useSelector((state) => state.auth.user);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  /**
   * FILE SELECT
   */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    try {
      socket.emit("typing", {
        groupId: channelId,
        userName: user.name,
      });
    } catch (err) {
      // socket may not be connected
    }

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      try {
        socket.emit("stop-typing", { groupId: channelId });
      } catch (err) {
        // ignore
      }
    }, 1000);
  };

  /**
   * SEND MESSAGE
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() && !selectedFile) {
      return;
    }

    try {
      // setLoading(true);

      /**
       * TEXT MESSAGE
       */
      const payload = {
        groupId: channelId,
        message,
        messageType: selectedFile ? "file" : "text",
        attachments: [],
      };

      const msg = await chatApi.post("/messages", payload);
      const messagePayload = msg.data.data || msg.data;
      const senderId = user?.userId || user?.id || user?._id;
      const senderName =
        user?.name || user?.userName || user?.fullName || "You";
      const clientMessageId =
        window.crypto?.randomUUID?.() ||
        `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const outgoingMessage = {
        ...messagePayload,
        senderId,
        senderName,
        groupId: messagePayload.groupId || channelId,
        clientMessageId,
      };

      setMessage("");

      setSelectedFile(null);

      setShowEmojiPicker(false);
      socket.emit("stop-typing", {
        groupId: channelId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="border-t border-gray-200 px-6 py-4 bg-white relative"
    >
      {/* Selected File */}
      {/* {selectedFile && (
        <div className="mb-3 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
          <p className="text-sm truncate">{selectedFile.name}</p>

          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      )} */}

      {/* INPUT */}
      <div className="flex items-end gap-3">
        {/* FILE */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileSelect}
        />

        {/* TEXT INPUT */}
        {/* <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div> */}
        <div className="flex-1 relative">
          {/* FILE PREVIEW INSIDE INPUT */}
          {selectedFile && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm max-w-[220px] z-10">
              <Paperclip className="w-4 h-4 text-purple-600" />

              <p className="text-sm truncate text-gray-700">
                {selectedFile.name}
              </p>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-red-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* TEXT INPUT */}
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message"
            className={`w-full bg-gray-100 rounded-2xl py-3 pr-4 outline-none text-sm text-gray-800 placeholder:text-gray-400 ${
              selectedFile ? "pl-64" : "pl-4"
            }`}
          />
        </div>

        {/* EMOJI */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-16 right-4 z-50"
            >
              <Picker
                data={data}
                theme="light"
                previewPosition="none"
                skinTonePosition="search"
                onEmojiSelect={(emoji) => {
                  setMessage((prev) => prev + emoji.native);
                }}
              />
            </div>
          )}
        </div>

        {/* SEND */}
        <button
          type="submit"
          disabled={loading || (!message.trim() && !selectedFile)}
          className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? (
            <span className="text-sm">...</span>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2">Press Enter to send message</p>
    </form>
  );
}
