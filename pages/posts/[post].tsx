import axios from "axios";
import { GetServerSideProps } from "next";
import { Animal } from "../reports/types";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledContainerTwo,
  StyledDivHeader,
} from "@/components/styledComponents/StyledContainer";
import { Container, TextField, Typography } from "@mui/material";
import BackOfficeLayout, {
  StyledButton,
} from "@/components/layout/BackOfficeLayout";
import {
  AnswerChoice,
  AnswerType,
  DateTimeAnswerType,
  ImageAnswerType,
  LocationAnswerType,
  TextAnswerType,
} from "@/components/post/AnswerChoice";
import { ReportTypeVersionSimpleResponseDto } from "../reports/types/[animal]";
import { responseToCsvData } from "@/components/styledComponents/ReportResponseTable";
import { useRouter } from "next/router";

export interface SpecificReportResponseDto {
  answers: AnswerType[];
  reportTypeVersion: { id: number; reportType: { id: number } };
  post: { id: number };
}

const imageAnswerType = ["IMAGE", "FILE", "VIDEO"];

const Post = ({
  report,
  reportTypeVersion,
  post,
}: {
  report: SpecificReportResponseDto;
  reportTypeVersion: ReportTypeVersionSimpleResponseDto;
  post: any;
}) => {
  console.log(reportTypeVersion, report, post);
  const router = useRouter();
  const formData = useMemo(() => new FormData(), []);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [postInfo, setPostInfo] = useState({
    postId: 0,
    reportType: "리포트 타입",
    postDate: "게시일자",
    title: "포스트 제목",
    value: "포스트 내용",
  });
  const [postChanges, setPostChanges] = useState<boolean>();
  const [reportChanges, setReportChanges] = useState<boolean>();

  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostInfo((prevState) => {
      return {
        ...prevState,
        [name as keyof typeof postInfo]: value,
      };
    });
    setPostChanges(true);
  };

  const handleSavePostChanges = async () => {
    try {
      const updatedPostInfo = {
        title: postInfo.title,
        value: postInfo.value,
        modifiedReason: "",
      };
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/posts/${router.query.post}`,
        updatedPostInfo
      );
      alert("change to post id");

      console.log("변경사항이 성공적으로 반영되었습니다.", response.data);
      setShowSuccessMessage(true);
      setPostChanges(false);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log("에러 발생: ", error);
    }
  };

  const handleModifyReport = () => {
    console.log(answers.flat().filter((answer) => answer.modified === true));
    console.log(typeof router.query.post, typeof reportTypeVersion.id);
    formData.append(
      "data",
      JSON.stringify({
        reportTypeId: report.reportTypeVersion.reportType.id,
        reportTypeVersionId: report.reportTypeVersion.id,
        answers: answers.flat().filter((answer) => answer.modified === true),
      })
    );
    reportTypeVersion.questions.forEach((question, index) => {
      if (imageAnswerType.includes(question.type)) {
        answers[index].forEach((image: ImageAnswerType) => {
          if (image.value.fileUrl !== undefined) {
            formData.append(image.value.fileKey, image.value.fileUrl); //data 먼저 추가하는거 짱 중요합니다...
          }
        });
      }
    });

    axios
      .patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/${router.query.post}/answers`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          transformRequest: (formData) => formData,
        }
      )
      .then(function (response) {
        if (response.status == 200) {
          console.log("Modify report:", response);
          setReportChanges(false);
        } else {
          console.log(response);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const returnAnswer = (questionID: number, questionType: string) => {
    const loggedAnswers = report.answers
      .filter((answer) => answer.question?.id == questionID)
      .map(
        (answer) =>
          ({
            value: answer.value,
            type: questionType,
            questionId: questionID,
          } as AnswerType)
      );

    if (loggedAnswers.length === 0) {
      switch (questionType) {
        case "DATETIME":
          return [
            {
              value: null,
              type: questionType,
              questionId: questionID,
            } as DateTimeAnswerType,
          ];
        case "LOCATION":
          return [
            {
              value: {
                latitude: 33.3846,
                longitude: 126.5535,
                address: "",
                addressDetail: "",
              },
              type: questionType,
              questionId: questionID,
            } as LocationAnswerType,
          ];
        case "IMAGE":
        case "FILE":
        case "VIDEO":
          return [
            {
              value: { fileType: "IMAGE", fileKey: "" },
              type: questionType,
              questionId: questionID,
            } as ImageAnswerType,
          ];
        case "SHORT_ANSWER":
        case "LONG_ANSWER":
        case "MULTIPLE_CHOICE(SINGLE)":
        case "MULTIPLE_CHOICE(MULTI)":
        default:
          return [
            {
              value: "",
              type: questionType,
              questionId: questionID,
            } as TextAnswerType,
          ];
      }
    }
    if (imageAnswerType.includes(questionType)) {
      loggedAnswers.push({
        value: { fileType: "IMAGE", fileKey: "" },
        type: questionType,
        questionId: questionID,
      });
    }
    return loggedAnswers;
  };

  const [answers, setAnswers] = useState(
    reportTypeVersion &&
      reportTypeVersion.questions.map((question, index) =>
        returnAnswer(question.id, question.type)
      )
  );

  const updateAnswers = useCallback(
    (questionIndex: number, newAnswers: AnswerType[]) => {
      setAnswers((prevAnswers: AnswerType[][]) => {
        const updatedAnswers = prevAnswers.map(
          (prevAnswer: AnswerType[], index: number) =>
            index === questionIndex ? (newAnswers as AnswerType[]) : prevAnswer
        );
        return updatedAnswers;
      });
      setReportChanges(true);
    },
    [answers]
  );

  if (!report) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <React.Fragment>
      <StyledContainerOne
        style={{
          backgroundColor: "white",
          rowGap: "3rem",
          height: "auto",
          justifyContent: "start",
        }}
      >
        <StyledDivHeader>
          <Typography variant="h2">포스트 정보</Typography>
          <StyledButton
            color="primary"
            sx={{ marginLeft: "auto" }}
            disabled={!postChanges}
            onClick={handleSavePostChanges}
          >
            변경사항 저장하기
          </StyledButton>
        </StyledDivHeader>

        <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
          <StyledContainerThree>
            <Typography variant="body1">포스트ID</Typography>
            <TextField
              hiddenLabel
              variant="filled"
              value={postInfo.postId}
              disabled
            />
          </StyledContainerThree>
          <StyledContainerThree>
            <Typography variant="body1">리포트 타입</Typography>
            <TextField
              hiddenLabel
              variant="filled"
              value={postInfo.reportType}
              disabled
            />
          </StyledContainerThree>
          <StyledContainerThree>
            <Typography variant="body1">게시일자</Typography>
            <TextField
              hiddenLabel
              variant="filled"
              value={postInfo.postDate}
              disabled
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
              variant="standard"
              name="title"
              value={postInfo.title}
              onChange={handlePostChange}
            />
          </StyledContainerThree>
          <StyledContainerThree>
            <Typography variant="body1">내용</Typography>
            <TextField
              hiddenLabel
              variant="standard"
              name="value"
              value={postInfo.value}
              onChange={handlePostChange}
            />
          </StyledContainerThree>
        </div>
      </StyledContainerOne>
      <StyledContainerOne
        style={{
          backgroundColor: "white",
          rowGap: "3rem",
          height: "auto",
          justifyContent: "start",
        }}
      >
        <StyledDivHeader>
          <Typography variant="h2">리포트 내용</Typography>
          <StyledButton
            onClick={handleModifyReport}
            sx={{ marginLeft: "auto" }}
            disabled={!reportChanges}
          >
            변경사항 저장하기
          </StyledButton>
        </StyledDivHeader>

        {reportTypeVersion.questions.map((question, index) => (
          <StyledContainerThree
            key={index}
            style={{ width: "100%", rowGap: "1.5rem" }}
          >
            <Typography variant="h2">질문 {index + 1}</Typography>
            <Typography variant="h3">{question.title}</Typography>
            {/* {JSON.stringify(answers[index])} */}
            <AnswerChoice
              currentAnswer={answers[index]}
              updateAnswers={(newAnswers: AnswerType[]) =>
                updateAnswers(index, newAnswers)
              }
              questionType={question.type}
              options={question.options}
            />
          </StyledContainerThree>
        ))}
      </StyledContainerOne>
      {showSuccessMessage && (
        <Container
          color="primary"
          sx={{
            position: "fixed",
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
};

export default Post;

Post.getLayout = (page: ReactElement) => (
  <BackOfficeLayout>{page}</BackOfficeLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const setOrigin = {
    headers: {
      Origin: `${process.env.NEXT_PUBLIC_FRONT_URL}`,
    },
  };

  try {
    const reportResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/${context.query.post}`,
      setOrigin
    );
    const report: SpecificReportResponseDto = await reportResponse.data;

    const reportTypeVersionResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${report.reportTypeVersion.reportType.id}/versions/${report.reportTypeVersion.id}`,
      setOrigin
    );
    const reportTypeVersion = await reportTypeVersionResponse.data;

    // const postResponse = await axios.get(
    //   `${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${report.post.id}`,
    //   setOrigin
    // );
    // const post = await postResponse.data;

    return { props: { report, reportTypeVersion } };
  } catch (error) {
    return { props: {} };
  }
};