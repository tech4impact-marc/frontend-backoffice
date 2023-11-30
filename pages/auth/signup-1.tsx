import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function NoSignUp() {
  const router = useRouter();
  const [ex, setEx] = useState(true);

  useEffect(() => {
    if (ex) {
      setEx(false);
    } else {
      alert("관리자로 인증된 계정만 이용할 수 있는 서비스입니다.");
      router.push("/");
    }
  }, [ex]);

  return <></>;
}
