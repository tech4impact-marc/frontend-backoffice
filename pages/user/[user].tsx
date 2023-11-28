import { StyledButton } from "@/components/layout/BackOfficeLayout";
import {
  StyledContainerOne,
  StyledContainerThree,
} from "@/components/styledComponents/StyledContainer";
import StickyHeadTable3 from "@/components/styledComponents/StyledTable3";
import { Container, Pagination, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

//import dataResponse from "@/pages/user/contents";

const columns: string[] = ["리포트 ID", "리포트 타입", "게시 일자"];

export default function User() {
  const router = useRouter();
  const { user } = router.query;
  const [initialUserInfo, setInitialUserInfo] = useState({
    userId: 0,
    signup: "",
    nickname: "",
    email: "",
    phoneNumber: "",
  });
  const [userInfo, setUserInfo] = useState({
    userId: 0,
    signup: "",
    nickname: "",
    email: "",
    phoneNumber: "",
  });
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [isPhoneNumberChanged, setIsPhoneNumberChanged] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [rows, setRows] = useState<
    { "리포트 ID": number; "리포트 타입": string; "게시 일자": string }[]
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

    params.size = 10;

    try {
      const response = await axios.get(`http://3.37.177.6/api/admin/reports`, {
        params: params,
      });
      const dataResponse = response.data;
      console.log(dataResponse);
      const newRows = dataResponse.contents.map((report: any) => ({
        "리포트 ID": report.id,
        "리포트 타입": report.reportTypeVersion.reportType.label,
        "게시 일자": report.createdDateTime,
      }));

      console.log(newRows);
      setRows(newRows);
      setTotalNumberOfPages(dataResponse.totalNumberOfPages);
    } catch (error) {
      console.log("에러 발생: ", error);
    }
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = event.target.value;
    setUserInfo({
      ...userInfo,
      nickname: newNickname,
    });
    setIsNicknameChanged(newNickname !== initialUserInfo.nickname);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setUserInfo({
      ...userInfo,
      email: newEmail,
    });
    setIsEmailChanged(newEmail !== initialUserInfo.email);
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPhoneNumber = event.target.value;
    setUserInfo({
      ...userInfo,
      phoneNumber: newPhoneNumber,
    });
    setIsPhoneNumberChanged(newPhoneNumber !== initialUserInfo.phoneNumber);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUserInfo = {
        nickname: userInfo.nickname,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        profileIsDefaultImage: false,
      };
      console.log(updatedUserInfo);
      console.log(userInfo.userId);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/users/${userInfo.userId}`,
        { params: { userId: userInfo.userId }, updatedUserInfo }
      );

      console.log("변경사항이 성공적으로 반영되었습니다.", response.data);
      setShowSuccessMessage(true);

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
    console.log(currentPage);
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
        console.log(user);
        console.log(response.data);
        if (response.data.totalNumberOfElements === 0) {
          alert("존재하지 않는 유저입니다.");
          router.back();
        }
        const userData = response.data.contents[0];
        setInitialUserInfo({
          userId: userData.id,
          signup: userData.createdDateTime,
          nickname: userData.nickname,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });
        setUserInfo({
          userId: userData.id,
          signup: userData.createdDateTime,
          nickname: userData.nickname,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });
        console.log(user);
        console.log(userInfo);
        console.log(userInfo.userId);
      } catch (error) {
        console.log("에러 발생: ", error);
      }
    };

    fetchData();
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  }, [user]);

  useEffect(() => {
    if (userInfo.userId === 0) {
      return;
    }
    console.log(currentPage, userInfo.userId);
    fetchReport(currentPage, userInfo.userId);
  }, [currentPage, userInfo.userId]);

  return (
    <React.Fragment>
      <Container sx={{ padding: "0", alignItems: "flex-start" }}>
        <Container
          sx={{
            width: "100%",
            height: "120px",
            backgroundColor: "#F2F2F2",
            justifyContent: "center",
            padding: "32px",
          }}
        >
          <Typography variant="h1">회원관리</Typography>
        </Container>
        <Container
          sx={{
            alignItems: "flex-start",
            alignSelf: "stretch",
            padding: "16px 32px 32px 32px",
            gap: "16px",
            flex: "1 0 0",
          }}
        >
          <StyledContainerOne
            style={{
              backgroundColor: "white",
              rowGap: "1.5rem",
              height: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                columnGap: "1rem",
                alignItems: "center",
              }}
            >
              <Container sx={{ flexDirection: "row" }}>
                <Typography variant="h2">유저 정보</Typography>
                <StyledButton
                  variant="contained"
                  color="secondary"
                  //   onClick={handleSubmit}
                  style={{ marginLeft: "auto" }}
                  disableElevation
                  disabled={
                    !(
                      isNicknameChanged ||
                      isEmailChanged ||
                      isPhoneNumberChanged
                    )
                  }
                  onClick={handleSaveChanges}
                >
                  변경사항 저장하기
                </StyledButton>
              </Container>
            </div>

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
            <Container sx={{ flexDirection: "row" }}>
              <Typography variant="h2">유저 리포트</Typography>

              <Pagination
                count={totalNumberOfPages}
                page={currentPage + 1}
                onChange={handlePageChange}
                sx={{
                  marginLeft: "auto",
                }}
              />
            </Container>
            <StickyHeadTable3 columns={columns} rows={rows} />
          </StyledContainerOne>
        </Container>
      </Container>
      {showSuccessMessage && (
        <Container
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
          <Typography variant="body1" color="secondary">
            변경사항이 저장되었습니다.
          </Typography>
        </Container>
      )}
    </React.Fragment>
  );
}
