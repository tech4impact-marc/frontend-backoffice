import { Button, styled } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

import { StyledContainerOne } from "@/components/styledComponents/StyledContainer";

const backOfficeLinks = [
  { link: "/user", name: "회원관리" },
  { link: "/report", name: "리포트 관리" },
  // { link: "/post", name: "포스트 관리" },
];

export const StyledButton = styled(Button)`
  padding: 0.6rem 2rem;
  border-radius: 8px;
  border: 1px solid var(--Gray-4, #bdbdbd);
`;

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <StyledContainerOne
        style={{
          minWidth: "250px",
          maxWidth: "250px",
          position: "fixed",
          backgroundColor: "white",
          zIndex: "999",
          rowGap: "1rem",
        }}
      >
        {backOfficeLinks.map(({ link, name }, index) => (
          <StyledButton
            key={index}
            variant="contained"
            color="secondary"
            onClick={() => {
              router.push(link);
            }}
            disabled={router.pathname == link}
            disableElevation
          >
            {name}
          </StyledButton>
        ))}

        <StyledButton
          variant="contained"
          color="secondary"
          onClick={() => {
            alert("need logout");
          }}
          sx={{ marginTop: "auto" }}
          disableElevation
        >
          로그아웃
        </StyledButton>
      </StyledContainerOne>
      <StyledContainerOne
        style={{
          minWidth: "100vw",
          minHeight: "100vh",
          backgroundColor: "#eee",
          height: "auto",

          padding: "3rem",
          rowGap: "1rem",
          paddingLeft: "calc(250px + 3rem)",
        }}
      >
        {children}
      </StyledContainerOne>
    </div>
  );
}
