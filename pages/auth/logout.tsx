import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { store } from "@/redux/store";

const LogoutPage = () => {
  const router = useRouter();
  const [ex, setEx] = useState(true);

  useEffect(() => {
    const state = store.getState();
    if (ex) {
      setEx(false);
    } else {
      if (Object.keys(state.tokens).length === 0) {
        alert("로그인 상태가 아닙니다.");
        router.push("/");
      } else {
        window.location.href = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/logout?bof`;
      }
    }
  }, [ex]);

  return <div>LOGOUT...</div>;
};

export default LogoutPage;
