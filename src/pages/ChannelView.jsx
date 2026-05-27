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
    });
  }, [id]);

  useEffect(() => {
    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  useEffect(() => {
    socket.on("user-typing", ({ userName }) => {
      setTypingUser(userName);
    });

    socket.on("user-stop-typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, []);

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
      />
    </div>
  );
}
