import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import channelsReducer from "./slices/channelsSlice.js";
import messagesReducer from "./slices/messagesSlice.js";
import groupsReducer from "./slices/groupsSlice.js";
import uiReducer from "./slices/uiSlice.js";
import personalReducer from "./slices/personalSlice.js";
import presenceReducer from "./slices/presenceSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    groups: groupsReducer,
    ui: uiReducer,
    personal: personalReducer,
    presence: presenceReducer,
  },
});

export default store;
