import axios from "axios";
import { GetServerSideProps } from "next";
import { Animal } from "../reports/types";
import React, { useCallback, useMemo, useState } from "react";
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledContainerTwo,
  StyledDivHeader,
} from "@/components/styledComponents/StyledContainer";
import { Typography } from "@mui/material";
import { StyledButton } from "@/components/layout/BackOfficeLayout";
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

export interface SpecificReportResponseDto {
  answers: AnswerType[];
  reportTypeVersion: { id: number; reportType: { id: number } };
  post: { id: number };
}

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

  const handleModifyReport = () => {};

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
    },
    []
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
          <Typography variant="h2">리포트 버전 정보</Typography>
          <StyledButton
            onClick={handleModifyReport}
            sx={{ marginLeft: "auto" }}
          >
            수정사항 저장하기
          </StyledButton>
        </StyledDivHeader>

        {reportTypeVersion.questions.map((question, index) => (
          <StyledContainerThree
            key={index}
            style={{ width: "100%", rowGap: "1.5rem" }}
          >
            <Typography variant="h2">질문 {index + 1}</Typography>
            <Typography variant="h3">{question.title}</Typography>
            {JSON.stringify(answers[index])}
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
    </React.Fragment>
  );
};

export default Post;

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

    const postResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${report.post.id}`,
      setOrigin
    );
    const post = await postResponse.data;

    return { props: { report, reportTypeVersion, post } };
  } catch (error) {
    return { props: {} };
  }
};
