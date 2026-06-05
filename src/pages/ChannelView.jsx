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
  // const channel = channels.find((c) => c.id === channelId) || channels[0];
  // const channelMessages = messages[channelId] || [];
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

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
    if (!id) return;
    fetchChatGroup();
    socket.emit("join-group", {
      groupId: id,
      userId: user?.userId || user?.id,
      userName: user?.name,
    });

    return () => {
      socket.emit("leave-group", {
        groupId: id,
        userId: user?.userId || user?.id,
      });
    };
  }, [id, user]);

  useEffect(() => {
    if (!id) return;

    const normalizeMessage = (incoming) => {
      if (!incoming) return null;
      if (incoming.groupId) return incoming;
      if (incoming.message?.groupId) return incoming.message;
      if (incoming.data?.groupId) return incoming.data;
      if (incoming.message?.data?.groupId) return incoming.message.data;
      return incoming;
    };

    const handleReceiveMessage = (rawMessage) => {
      const newMessage = normalizeMessage(rawMessage);
      if (!newMessage) return;

      if (String(newMessage.groupId) === String(id)) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleUserTyping = ({ userName, groupId }) => {
      if (String(groupId) === String(id)) {
        setTypingUser(userName);
      }
    };

    const handleUserStopTyping = ({ groupId }) => {
      if (String(groupId) === String(id)) {
        setTypingUser("");
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("new-message", handleReceiveMessage);
    socket.on("message", handleReceiveMessage);
    socket.on("user-typing", handleUserTyping);
    socket.on("typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);
    socket.on("stop-typing", handleUserStopTyping);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("new-message", handleReceiveMessage);
      socket.off("message", handleReceiveMessage);
      socket.off("user-typing", handleUserTyping);
      socket.off("typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
      socket.off("stop-typing", handleUserStopTyping);
    };
  }, [id]);

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
      />

      {/* Messages Area */}
      <MessageList messages={messages} />
      {typingUser && (
        <div className="px-6 py-2 text-sm text-gray-500 italic">
          {typingUser} typing...
        </div>
      )}

      {/* Message Input */}
      <MessageInput
        channelId={groupData.groupId}
        refreshGroup={fetchChatGroup}
        onMessageSent={(newMessage) =>
          setMessages((prev) => {
            const exists = prev.some(
              (msg) =>
                String(msg._id || msg.id || msg.messageId) ===
                String(newMessage._id || newMessage.id || newMessage.messageId),
            );
            if (exists) return prev;
            return [...prev, newMessage];
          })
        }
      />
    </div>
  );
}
