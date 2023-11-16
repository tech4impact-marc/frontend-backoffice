import { StyledButton } from "@/components/layout/BackOfficeLayout";
import {
  StyledContainerOne,
  StyledContainerThree,
} from "@/components/styledComponents/StyledContainer";
import StyledPagination from "@/components/styledComponents/StyledPagination";
import StickyHeadTable from "@/components/styledComponents/StyledTable";
import { TextField, Typography } from "@mui/material";
import React from "react";

//저 React.Fragment안에 다 추가하면 됩니다!!!

const columns: string[] = ["포스트 ID", "리포트 타입", "게시 일자", "메모"]; //걍 가져오기
const rows = [
  {
    "포스트 ID": "001",
    "리포트 타입": "남방큰돌고래",
    "게시 일자": "2023-11-01",
    메모: "특이사항",
  },
  {
    "포스트 ID": "001",
    "리포트 타입": "남방큰돌고래",
    "게시 일자": "2023-11-01",
    메모: "특이사항",
  },
  {
    "포스트 ID": "001",
    "리포트 타입": "남방큰돌고래",
    "게시 일자": "2023-11-01",
    메모: "특이사항",
  },
];

export default function User() {
  return (
    <React.Fragment>
      <StyledContainerOne
        style={{ backgroundColor: "white", rowGap: "1.5rem", height: "auto" }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            columnGap: "1rem",
            alignItems: "center",
          }}
        >
          <Typography variant="h2">유저 정보</Typography>
          <StyledButton
            variant="contained"
            color="secondary"
            //   onClick={handleSubmit}
            style={{ marginLeft: "auto" }}
            disableElevation
          >
            편집 내용 저장하기
          </StyledButton>
        </div>

        <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
          <StyledContainerThree>
            <Typography variant="body1">제목</Typography>
            <TextField
              variant="outlined"
              name={"title"}
              // value={responseType.title}
              // onChange={handleChange}
            />
          </StyledContainerThree>
          <StyledContainerThree>
            <Typography variant="body1">부제목</Typography>
            <TextField
              variant="outlined"
              name={"subtitle"}
              // value={responseType.subtitle}
              // onChange={handleChange}
            />
          </StyledContainerThree>
          <StyledContainerThree></StyledContainerThree>
        </div>
        <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
          <StyledContainerThree>
            <Typography variant="body1">제목</Typography>
            <TextField
              variant="outlined"
              name={"title"}
              // value={responseType.title}
              // onChange={handleChange}
            />
          </StyledContainerThree>
          <StyledContainerThree>
            <Typography variant="body1">부제목</Typography>
            <TextField
              variant="outlined"
              name={"subtitle"}
              // value={responseType.subtitle}
              // onChange={handleChange}
            />
          </StyledContainerThree>
          <StyledContainerThree>
            <Typography variant="body1">부제목</Typography>
            <TextField
              variant="outlined"
              name={"subtitle"}
              // value={responseType.subtitle}
              // onChange={handleChange}
            />
          </StyledContainerThree>
        </div>
      </StyledContainerOne>
      <StyledContainerOne
        style={{ backgroundColor: "white", rowGap: "1.5rem", height: "auto" }}
      >
        <Typography variant="h2">유저 포스트</Typography>

        <Typography variant="h1">및부분 스타일만 있어요!</Typography>
        <StyledPagination />
        <StickyHeadTable columns={columns} rows={rows} />
      </StyledContainerOne>
    </React.Fragment>
  );
}
