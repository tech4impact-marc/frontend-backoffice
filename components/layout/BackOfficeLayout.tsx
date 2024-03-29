import {
  ButtonTypeMap,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";

import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { StyledContainerOne } from "@/components/styledComponents/StyledContainer";
import Image from "next/image";
import { Container } from "@mui/system";
import theme from "@/styles/theme";
import { NewFormButton } from "@/pages/reports/types";

const backOfficeLinks = {
  "/user": "회원관리",
  "/reports/types": "리포트 관리",
  "/auth/logout": "로그아웃",
};

const backOfficeHeaderLinks = {
  ...backOfficeLinks,
  "/post": "포스트관리",
};

export const StyledButton = (props: ButtonProps) => {
  return (
    <Button
      variant={props.variant ? props.variant : "contained"}
      sx={{
        padding: "0.7rem 2rem",
        borderRadius: "0.5rem",
        ...props.sx,
      }}
      onClick={props.onClick}
      disabled={props.disabled}
      color={props.color ? props.color : "primary"}
      name={props.name}
      startIcon={props.startIcon}
      disableElevation
    >
      {props.children}
    </Button>
  );
};

const MenuButton = ({
  path,
  style,
}: {
  path: string;
  style?: React.CSSProperties;
}) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <Button
      variant="text"
      color="secondary"
      onClick={() => {
        router.push(path);
      }}
      startIcon={<CircleOutlinedIcon sx={{ width: "1rem" }} />}
      disabled={pathname == path}
      style={{
        justifyContent: "flex-start",
        padding: "0.6rem 1.2rem",
        ...style,
      }}
    >
      {backOfficeLinks[path as keyof typeof backOfficeLinks]}
    </Button>
  );
};

export default function BackOfficeLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const router = useRouter();
  const { pathname, query } = router;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <StyledContainerOne
        style={{
          minWidth: "180px",
          maxWidth: "180px",
          position: "fixed",
          backgroundColor: "white",
          zIndex: "10",
          rowGap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "0.6rem",
            marginBottom: "0.5rem",
          }}
        >
          <Image
            src="/marc_logo.png"
            alt={"logo"}
            width={30}
            height={30}
          ></Image>
          <Typography variant="h2">MARC</Typography>
        </div>
        {Object.keys(backOfficeLinks).map((path: string, index) => (
          <MenuButton
            key={index}
            path={path}
            style={{ marginTop: path === "/auth/logout" ? "auto" : "0" }}
          />
        ))}
      </StyledContainerOne>
      <Container
        style={{
          minWidth: "calc(100vw - 180px)",
          height: "7rem",
          position: "fixed",
          backgroundColor: "#F2F2F2",
          zIndex: "998",

          padding: "3rem",
          marginLeft: "180px",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography variant="h1">
          {
            title
              ? title
              : backOfficeHeaderLinks[
                  Object.keys(backOfficeHeaderLinks).find((link) =>
                    pathname.includes(link)
                  ) as keyof typeof backOfficeHeaderLinks
                ] // 흐음 바꿔야 할수도...
          }
        </Typography>
        {pathname === "/reports/types" && <NewFormButton />}
      </Container>
      <StyledContainerOne
        style={{
          minWidth: "calc(100vw - 180px)",
          minHeight: "100vh",
          backgroundColor: "#F9F9F9",
          height: "auto",

          marginLeft: "180px",
          padding: "3rem",
          rowGap: "1rem",
          paddingTop: "calc(7rem + 3rem)",
        }}
      >
        {children}
      </StyledContainerOne>
    </div>
  );
}
