import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import MessageList from "../components/MessageList.jsx";
import MessageInput from "../components/MessageInput.jsx";
import ChannelHeader from "../components/ChannelHeader.jsx";

export default function ChannelView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedChannelId = useSelector(
    (state) => state.channels.selectedChannelId,
  );
  const channels = useSelector((state) => state.channels.channels);
  const messages = useSelector((state) => state.messages.messages);

  const channelId = id ? parseInt(id) : selectedChannelId;
  const channel = channels.find((c) => c.id === channelId) || channels[0];
  const channelMessages = messages[channelId] || [];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Channel Header */}
      <ChannelHeader channel={channel} />

      {/* Messages Area */}
      <MessageList messages={channelMessages} />

      {/* Message Input */}
      <MessageInput channelId={channelId} />
    </div>
  );
}
