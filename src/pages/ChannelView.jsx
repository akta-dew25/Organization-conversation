import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import MessageList from "../components/MessageList.jsx";
import MessageInput from "../components/MessageInput.jsx";
import ChannelHeader from "../components/ChannelHeader.jsx";
import chatApi from "../api/chatApi.js";
import { socket } from "../socket/socket.js";

export default function ChannelView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const selectedChannelId = useSelector(
    (state) => state.channels.selectedChannelId,
  );
  // const channels = useSelector((state) => state.channels.channels);
  // const messages = useSelector((state) => state.messages.messages);

  const channelId = id ? parseInt(id) : selectedChannelId;
  const userId = user?.userId || user?.id;
  // const channel = channels.find((c) => c.id === channelId) || channels[0];
  // const channelMessages = messages[channelId] || [];
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [readReceipts, setReadReceipts] = useState({});

  useEffect(() => {
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online-users");
    };
  }, []);

  const fetchChatGroup = async () => {
    try {
      // setLoading(true);

      const { data } = await chatApi.get(`/chat-group/${id}`);

      setGroupData(data.data.group);
      setMessages(data.data.messages || []);
      setMembers(data.data.members || []);
    } catch (error) {
      console.log("Failed to fetch group", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    socket.on("message-read", (data) => {
      setReadReceipts((prev) => ({
        ...prev,
        [data.messageId]: data,
      }));
    });

    return () => {
      socket.off("message-read");
    };
  }, []);
  useEffect(() => {
    if (!id) return;
    fetchChatGroup();

    const payload = {
      groupId: id,
      userId,
      userName: user?.name,
    };

    try {
      socket.emit("join-group", payload);
    } catch (err) {
      console.error("Failed to emit join-group:", err);
    }

    return () => {
      try {
        socket.emit("leave-group", {
          groupId: id,
          userId,
        });
      } catch (err) {
        // ignore
      }
    };
  }, [id, userId]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (String(message.groupId) !== String(id)) {
        return;
      }

      setMessages((prev) => {
        const exists = prev.some(
          (msg) => String(msg._id) === String(message._id),
        );

        if (exists) return prev;

        return [...prev, message];
      });
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [id]);

  useEffect(() => {
    if (!messages.length) return;

    socket.emit("mark-message-read", {
      groupId: id,
      userId: user.id || user.userId,
      messageId: messages[messages.length - 1]._id,
    });
  }, [messages]);

  // if (loading) {
  //   return (
  //     <div className="flex-1 flex items-center justify-center">Loading...</div>
  //   );
  // }

  if (!groupData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Group not found
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Channel Header */}
      <ChannelHeader
        channel={groupData}
        members={members}
        refreshGroup={fetchChatGroup}
        onlineUsers={onlineUsers}
      />

      {/* Messages Area */}
      <MessageList messages={messages} />
      {typingUser && (
        <div className="px-6 py-2 text-sm text-gray-500 italic">
          {typingUser} typing...
        </div>
      )}

      {/* Message Input */}
      <MessageInput channelId={groupData.groupId} />
    </div>
  );
}
