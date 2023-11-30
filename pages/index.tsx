import { Container, Typography } from "@mui/material";
import Image from "next/image";
import marc_logo from "@/public/marc_logo.png";
import { StyledButton } from "@/components/layout/BackOfficeLayout";
import { store } from "@/redux/store";
import { ReactElement } from "react";

const Home = () => {
  const state = store.getState();
  const goLogin = () => {
    window.location.href = "/auth/login";
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
        {state.isAdmin ? (
          <Typography variant="h2">
            어서오세요, {state.user.nickname}님.
          </Typography>
        ) : (
          <Container
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Typography variant="h2">
              로그인 후 이용할 수 있는 서비스입니다.
            </Typography>
            <StyledButton
              color="primary"
              onClick={goLogin}
              sx={{ width: "358px" }}
            >
              <Typography variant="button">로그인하기</Typography>
            </StyledButton>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default Home;

Home.getLayout = (page: ReactElement) => <>{page}</>;
