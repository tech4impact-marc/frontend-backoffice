import BackOfficeLayout, {
  StyledButton,
} from "@/components/layout/BackOfficeLayout";
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledDivHeader,
} from "@/components/styledComponents/StyledContainer";
import StickyHeadTableUser2 from "@/components/styledComponents/StyledTableUser2";
import {
  Button,
  Container,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

//import dataResponse from "@/pages/user/contents";

const columns: string[] = ["포스트 ID", "리포트 타입", "게시 일자"];

export default function User() {
  const router = useRouter();
  const { user } = router.query;
  const [userInfo, setUserInfo] = useState({
    userId: 0,
    signup: "",
    nickname: "",
    email: "",
    phoneNumber: "",
  });
  const [prevUserInfo, setPrevUserInfo] = useState({
    nickname: "",
    email: "",
    phoneNumber: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [rows, setRows] = useState<
    { "포스트 ID": number; "리포트 타입": string; "게시 일자": string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);

  const fetchReport = async (pageArg: number = 0, userId: number = 0) => {
    const params: { [key: string]: number | string } = {};

    if (pageArg) {
      params.page = pageArg;
    }

    if (userId) {
      params.user = userId;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports`,
        {
          params: params,
        }
      );

      const dataResponse = response.data;
      const newRows = dataResponse.contents.map((report: any) => ({
        "포스트 ID": report.post.id,
        "리포트 타입": report.reportTypeVersion.reportType.label,
        "게시 일자": report.createdDateTime,
      }));

      setRows(newRows);
      setTotalNumberOfPages(dataResponse.totalNumberOfPages);
    } catch (error) {
      console.log("에러 발생: ", error);
    }
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      nickname: event.target.value,
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      email: event.target.value,
    });
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserInfo({
      ...userInfo,
      phoneNumber: event.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUserInfo = {
        nickname: userInfo.nickname,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        profileIsDefaultImage: false,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/users/${userInfo.userId}`,
        updatedUserInfo
      );

      console.log("변경사항이 성공적으로 반영되었습니다.", response.data);
      setShowSuccessMessage(true);
      setPrevUserInfo({
        nickname: userInfo.nickname,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
      });

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log("에러 발생: ", error);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    newPage: number
  ) => {
    setCurrentPage(newPage - 1);
    fetchReport(currentPage, userInfo.userId);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/users`,
          {
            params: {
              nickname: user,
            },
          }
        );
        if (response.data.totalNumberOfElements === 0) {
          alert("존재하지 않는 유저입니다.");
          router.back();
        }
        const userData = response.data.contents.find(
          (oj: any) => oj.nickname === user
        );
        setUserInfo({
          userId: userData.id,
          signup: userData.createdDateTime,
          nickname: userData.nickname,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });
        setPrevUserInfo({
          nickname: userData.nickname,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });
      } catch (error) {
        console.log("에러 발생: ", error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (userInfo.userId === 0) {
      return;
    }
    fetchReport(currentPage, userInfo.userId);
  }, [currentPage, userInfo.userId]);

  return (
    <React.Fragment>
      <Container
        sx={{
          alignItems: "flex-start",
          alignSelf: "stretch",
          padding: "16px 32px 32px 32px",
          gap: "16px",
          flex: "1 0 0",
          maxWidth: "none",
        }}
      >
        <StyledContainerOne
          style={{
            backgroundColor: "white",
            rowGap: "1.5rem",
            height: "auto",
          }}
        >
          <StyledDivHeader>
            <Typography variant="h2">유저 정보</Typography>
            <StyledButton
              color="primary"
              sx={{ marginLeft: "auto" }}
              disabled={
                !(
                  userInfo.nickname !== prevUserInfo.nickname ||
                  userInfo.email !== prevUserInfo.email ||
                  userInfo.phoneNumber !== prevUserInfo.phoneNumber
                )
              }
              onClick={handleSaveChanges}
            >
              변경사항 저장하기
            </StyledButton>
          </StyledDivHeader>

          <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
            <StyledContainerThree>
              <Typography variant="body1">유저 ID</Typography>
              <TextField
                variant="standard"
                name={"title"}
                value={userInfo.userId}
              />
            </StyledContainerThree>
            <StyledContainerThree>
              <Typography variant="body1">Signup</Typography>
              <TextField
                variant="standard"
                name={"subtitle"}
                value={userInfo.signup}
              />
            </StyledContainerThree>
            <StyledContainerThree></StyledContainerThree>
          </div>
          <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
            <StyledContainerThree>
              <Typography variant="body1">닉네임</Typography>
              <TextField
                variant="standard"
                name={"title"}
                value={userInfo.nickname}
                onChange={handleNicknameChange}
              />
            </StyledContainerThree>
            <StyledContainerThree>
              <Typography variant="body1">이메일</Typography>
              <TextField
                variant="standard"
                name={"subtitle"}
                value={userInfo.email}
                onChange={handleEmailChange}
              />
            </StyledContainerThree>
            <StyledContainerThree>
              <Typography variant="body1">전화번호</Typography>
              <TextField
                variant="standard"
                name={"subtitle"}
                value={userInfo.phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </StyledContainerThree>
          </div>
        </StyledContainerOne>
        <StyledContainerOne
          style={{
            backgroundColor: "white",
            rowGap: "1.5rem",
            height: "auto",
          }}
        >
          <StyledDivHeader>
            <Typography variant="h2">유저 포스트</Typography>

            <Pagination
              count={totalNumberOfPages}
              page={currentPage + 1}
              onChange={handlePageChange}
              sx={{
                marginLeft: "auto",
              }}
            />
          </StyledDivHeader>
          <StickyHeadTableUser2 columns={columns} rows={rows} />
        </StyledContainerOne>
      </Container>
      {showSuccessMessage && (
        <Container
          color="primary"
          sx={{
            position: "absolute",
            left: "calc(32px+3rem)",
            bottom: "32px",
            width: "240px",
            padding: "16px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#3DC74B",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: "600", color: "white" }}
          >
            변경사항이 저장되었습니다.
          </Typography>
        </Container>
      )}
    </React.Fragment>
  );
}

User.getLayout = (page: ReactElement) => (
  <BackOfficeLayout>{page}</BackOfficeLayout>
);
