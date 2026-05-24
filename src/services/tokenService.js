// Token service to manage access and refresh tokens
const TOKEN_STORAGE_KEY = "auth_tokens";
const USER_STORAGE_KEY = "auth_user";

export const tokenService = {
  // Save tokens to localStorage
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      JSON.stringify({ accessToken, refreshToken }),
    );
  },

  // Get tokens from localStorage
  getTokens: () => {
    try {
      const tokens = localStorage.getItem(TOKEN_STORAGE_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  },

  // Get only access token
  getAccessToken: () => {
    const tokens = tokenService.getTokens();
    return tokens?.accessToken || null;
  },

  // Get only refresh token
  getRefreshToken: () => {
    const tokens = tokenService.getTokens();
    return tokens?.refreshToken || null;
  },

  // Clear tokens from localStorage
  clearTokens: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  // Save user data
  setUser: (user) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  // Get user data
  getUser: () => {
    try {
      const user = localStorage.getItem(USER_STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Decode JWT token (basic decoding without verification)
  decodeToken: (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    const decoded = tokenService.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  },
};

export default tokenService;
