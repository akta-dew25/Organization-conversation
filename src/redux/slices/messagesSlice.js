import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: {
    1: [
      {
        id: 1,
        channelId: 1,
        sender: {
          id: 1,
          name: "Pooja Singh",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        content: "Hey team! How are you doing?",
        timestamp: new Date(Date.now() - 3600000),
        reactions: [],
        replies: 0,
      },
      {
        id: 2,
        channelId: 1,
        sender: {
          id: 2,
          name: "Arun Sharma",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
        content: "Great! Just finished the sprint planning",
        timestamp: new Date(Date.now() - 1800000),
        reactions: [],
        replies: 0,
      },
    ],
    2: [],
    3: [],
  },
  directMessages: {
    user1: [
      {
        id: 1,
        sender: { id: 1, name: "You" },
        content: "Hey! How is the project going?",
        timestamp: new Date(Date.now() - 7200000),
        read: true,
      },
    ],
  },
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { channelId, message } = action.payload;
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      state.messages[channelId].push(message);
    },
    deleteMessage: (state, action) => {
      const { channelId, messageId } = action.payload;
      if (state.messages[channelId]) {
        state.messages[channelId] = state.messages[channelId].filter(
          (m) => m.id !== messageId,
        );
      }
    },
    updateMessage: (state, action) => {
      const { channelId, messageId, content } = action.payload;
      if (state.messages[channelId]) {
        const message = state.messages[channelId].find(
          (m) => m.id === messageId,
        );
        if (message) {
          message.content = content;
        }
      }
    },
    addDirectMessage: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.directMessages[userId]) {
        state.directMessages[userId] = [];
      }
      state.directMessages[userId].push(message);
    },
    addReaction: (state, action) => {
      const { channelId, messageId, reaction } = action.payload;
      if (state.messages[channelId]) {
        const message = state.messages[channelId].find(
          (m) => m.id === messageId,
        );
        if (message) {
          if (!message.reactions) {
            message.reactions = [];
          }
          message.reactions.push(reaction);
        }
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addMessage,
  deleteMessage,
  updateMessage,
  addDirectMessage,
  addReaction,
  setLoading,
  setError,
} = messagesSlice.actions;

export default messagesSlice.reducer;
