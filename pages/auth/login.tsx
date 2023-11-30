import { Container, Typography } from "@mui/material";
import Image from "next/image";

import kakao_login_medium_wide from "@/public/kakao_login_medium_wide.png";
import marc_logo from "@/public/marc_logo.png";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao`;
  };
  return (
    <Container
      sx={{
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
        width: "100%",
        padding: "0px",
        backgroundColor: "white",
      }}
    >
      <Container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "stretch",
          padding: "16px",
          height: "100%",
          maxWidth: "100%",
          gap: "50px",
        }}
      >
        <Image src={marc_logo} alt="logo" width="108" />
        <Typography variant="h1">Backoffice</Typography>
      </Container>
      <Container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          height: "120px",
          padding: "16px 16px 40px 16px",
        }}
      >
        <Image
          src={kakao_login_medium_wide}
          alt="kakao_button"
          onClick={handleLogin}
        />
      </Container>
    </Container>
  );
}
