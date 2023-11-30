import {
  StyledContainerOne,
  StyledContainerThree,
} from "@/components/styledComponents/StyledContainer";
import { StyledButton } from "@/components/layout/BackOfficeLayout";
import { Button, Container, Input, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function User() {
  const router = useRouter();
  const { id } = router.query;
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [postInfo, setPostInfo] = useState({
    postId: 0,
    reportType: "리포트 타입",
    postDate: "게시일자",
    title: "",
    value: "",
  });
  const [prevPost, setPrevPost] = useState({
    title: "",
    value: "",
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostInfo({
      ...postInfo,
      title: event.target.value,
    });
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostInfo({
      ...postInfo,
      value: event.target.value,
    });
  };

  const handleSavePostChanges = async () => {
    try {
      const updatedPostInfo = {
        title: postInfo.title,
        value: postInfo.value,
        modifiedReason: "a",
      };
      console.log(updatedPostInfo, postInfo.postId);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/posts/${postInfo.postId}`,
        updatedPostInfo
      );

      console.log("변경사항이 성공적으로 반영되었습니다.", response.data);
      setShowSuccessMessage(true);
      setPrevPost({
        title: postInfo.title,
        value: postInfo.value,
      });
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log("에러 발생: ", error);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/${id}`
        );
        const reportData = response.data;
        setPostInfo((prevPostInfo) => ({
          ...prevPostInfo,
          postId: reportData.post.id,
          reportType: reportData.reportTypeVersion.reportType.label,
          postDate: reportData.createdDateTime,
        }));

        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${reportData.post.id}`
        );
        const reportData2 = response2.data;
        setPostInfo((prevPostInfo) => ({
          ...prevPostInfo,
          title: reportData2.title,
          value: reportData2.value,
        }));

        setPrevPost({
          title: reportData2.title,
          value: reportData2.value,
        });
      } catch (error) {
        console.log("에러 발생: ", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <React.Fragment>
      <Container
        sx={{
          alignItems: "flex-start",
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
          <Container sx={{ flexDirection: "row" }}>
            <Typography variant="h2">포스트 정보</Typography>
            <StyledButton
              color="primary"
              sx={{ marginLeft: "auto" }}
              disabled={
                !(
                  postInfo.title !== prevPost.title ||
                  postInfo.value !== prevPost.value
                )
              }
              onClick={handleSavePostChanges}
            >
              변경사항 저장하기
            </StyledButton>
          </Container>

          <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
            <StyledContainerThree>
              <Typography variant="body1">포스트ID</Typography>
              <TextField
                hiddenLabel
                id="filled-disabled"
                variant="filled"
                value={postInfo.postId}
              />
            </StyledContainerThree>
            <StyledContainerThree>
              <Typography variant="body1">리포트 타입</Typography>
              <TextField
                hiddenLabel
                variant="filled"
                value={postInfo.reportType}
              />
            </StyledContainerThree>
            <StyledContainerThree>
              <Typography variant="body1">게시일자</Typography>
              <TextField
                hiddenLabel
                variant="filled"
                name={"subtitle"}
                value={postInfo.postDate}
              />
            </StyledContainerThree>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              columnGap: "1rem",
            }}
          >
            <StyledContainerThree>
              <Typography variant="body1">제목</Typography>
              <TextField
                hiddenLabel
                id="filled-disabled"
                variant="filled"
                value={postInfo.title}
                onChange={handleTitleChange}
              />
            </StyledContainerThree>
            <StyledContainerThree>
              <Typography variant="body1">내용</Typography>
              <TextField
                hiddenLabel
                variant="filled"
                value={postInfo.value}
                onChange={handleValueChange}
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
          <Container
            sx={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          ></Container>
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
