import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { store } from "@/redux/store";

export default function LoginRedirectPage() {
  const router = useRouter();
  const [ex, setEx] = useState(true);
  const state = store.getState();

  useEffect(() => {
    async function login() {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/login/done`,
          state.loginState,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        console.log(response.data);
        store.dispatch({
          type: "SET_TOKENS",
          payload: response.data.tokens,
        });
        store.dispatch({ type: "SET_USER", payload: response.data.user });
        store.dispatch({
          type: "SET_ACCESSTOKEN_EXPIRESAT",
          payload: Date.now() + response.data.tokens.expiresIn * 1000,
        });
        store.dispatch({
          type: "SET_REFRESHTOKEN_EXPIRESAT",
          payload:
            Date.now() + response.data.tokens.refreshTokenExpiresIn * 1000,
        });
        store.dispatch({
          type: "SET_ISADMIN",
          payload: true,
        });
        router.push("/");
      } catch (error) {
        if (error.response.status === 403) {
          alert("관리자로 인증된 계정만 이용할 수 있는 서비스입니다.");
          router.push("/");
        }
        console.error("Error occured:", error);
      }
    }
    if (ex) {
      setEx(false);
    } else {
      login();
    }
  }, [ex]);

  return (
    <>
      Redirecting.. You will move to <b>main page</b> soon.
    </>
  );
}
