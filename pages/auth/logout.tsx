import { useEffect } from "react";
import { useRouter } from "next/router";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/logout`);
  }, []);

  return <div>LOGOUT...</div>;
};

export default LogoutPage;
