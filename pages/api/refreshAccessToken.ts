import axios from "axios";
import { store } from "@/redux/store";

async function refreshAccessToken() {
  const state = store.getState();
  const accessToken = state.tokens.accessToken;
  const refreshToken = state.tokens.refreshToken;
  const accessTokenExpiresAt = state.tokenExpiresAt.accessToken;
  console.log(accessToken);
  console.log(refreshToken);
  console.log(accessTokenExpiresAt);
  try {
    // 서버에 액세스 토큰과 리프레시 토큰을 담아 POST 요청 보내기
    const currentTime = Date.now();

    if (Object.keys(state.tokens).length === 0) {
      console.log("no token");
      return null;
    } else if (
      accessTokenExpiresAt === 0 ||
      accessTokenExpiresAt > currentTime
    ) {
      //not expired
      console.log("not expired");
      return {
        accessToken: accessToken,
        tokenType: "Bearer",
        expiresIn: state.tokens.expiresIn,
        refreshToken: refreshToken,
        refreshTokenExpiresIn: state.tokens.refreshTokenExpiresIn,
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/refresh`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Refresh: refreshToken,
        },
        withCredentials: true,
      }
    );

    // 새로운 jwtToken 받기
    const newjwtToken = response.data;
    store.dispatch({ type: "SET_TOKENS", payload: newjwtToken });
    store.dispatch({
      type: "SET_ACCESSTOKEN_EXPIRESAT",
      payload: currentTime + response.data.expiresIn * 1000,
    });

    console.log("AccessToken has been refreshed");

    // 새로운 jwtToken을 저장 또는 사용
    // ...

    return newjwtToken;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      //refreshToken Expired
      alert("토큰이 만료되었습니다. 다시 로그인해 주세요.");
      store.dispatch({ type: "SET_TOKENS", payload: {} });
      store.dispatch({ type: "SET_USER", payload: {} });
      store.dispatch({ type: "SET_ACCESSTOKEN_EXPIRESAT", payload: 0 });
      store.dispatch({ type: "SET_REFRESHTOKEN_EXPIRESAT", payload: 0 });
      store.dispatch({ type: "SET_ISADMIN", payload: false });
      window.location.href = "/auth/login";
    } else {
      console.error("토큰 리프레시 요청 실패:", error);
      throw error; // 에러 처리를 위해 예외를 다시 던질 수 있음
    }
  }
}

export default refreshAccessToken;
