import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { store } from "@/redux/store";

export default function KakaoLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/login/done`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        if (response.data.user.role === "USER") {
          alert("관리자로 인증된 계정만 이용할 수 있는 서비스입니다.");
          router.push("/");
        } else {
          store.dispatch({ type: "SET_TOKENS", payload: response.data.tokens });
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
        }
      })
      .catch((error) => {
        console.error("Error occured:", error);
      });
  }, []);

  return (
    <>
      Redirecting.. You will move to <b>main page</b> soon.
    </>
  );
}
