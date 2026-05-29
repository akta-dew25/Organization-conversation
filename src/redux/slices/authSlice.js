import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  organization: null,
  tokens: {
    accessToken: null,
    refreshToken: null,
  },
  loading: false,
  error: null,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.organization = action.payload.organization;
      state.tokens = {
        accessToken: action.payload.accessToken || null,
        refreshToken: action.payload.refreshToken || null,
      };
      state.loading = false;
      state.isAuthChecked = true;
    },
    loginError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isAuthenticated = false;
      state.user = action.payload.user;
      state.organization = action.payload.organization;
      state.loading = false;
    },
    registerError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.organization = null;
      state.tokens = { accessToken: null, refreshToken: null };
      state.loading = false;
      state.error = null;
      state.isAuthChecked = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    removeDeletedUser: (state, action) => {
      const deletedUserId = action.payload;

      // If logged in user deleted
      if (state.user?.userId === deletedUserId) {
        state.isAuthenticated = false;
        state.user = null;
        state.organization = null;
        state.tokens = {
          accessToken: null,
          refreshToken: null,
        };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginError,
  registerStart,
  registerSuccess,
  registerError,
  logout,
  updateUser,
  setAuthChecked,
  removeDeletedUser,
} = authSlice.actions;

export default authSlice.reducer;
