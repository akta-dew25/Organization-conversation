import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../redux/slices/authSlice";
import tokenService from "../services/tokenService";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = tokenService.getAccessToken();

    if (!accessToken) {
      dispatch(logout());
      return;
    }

    // check token expiry
    const isExpired = tokenService.isTokenExpired(accessToken);

    if (isExpired) {
      tokenService.clearTokens();
      dispatch(logout());
      return;
    }

    // decode token
    const decoded = tokenService.decodeToken(accessToken);

    // restore redux auth state
    dispatch(
      loginSuccess({
        user: {
          userId: decoded.userId,
          orgId: decoded.orgId,
          name: decoded.userName,
          role: decoded.role,
        },
        accessToken,
      }),
    );
  }, []);

  return children;
}
