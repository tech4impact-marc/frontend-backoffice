import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { store } from "@/redux/store";

export default function KakaoLoginPREPage() {
  const router = useRouter();

  useEffect(() => {
    async function loginPre() {
      const urlParams = new URLSearchParams(window.location.search);
      console.log(urlParams);
      const myParam = urlParams.get("code");
      console.log(myParam);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/login`,
          {
            params: { bof: "", code: myParam },
            withCredentials: true,
          }
        );
        // console.log(response.data);
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        store.dispatch({ type: "SET_LOGINSTATE", payload: response.data });

        if (response.data.loginState === "SIGNUP") {
          router.push("/auth/signup-1");
        } else if (response.data.loginState === "LOGIN") {
          router.push("/auth/redirect/login");
        }
      } catch (error) {
        console.error("오류가 발생했습니다.", error);
      }
    }

    loginPre();
  }, []);

  return (
    <>
      Redirecting.. You will move to <b>main page</b> soon.
    </>
  );
}
