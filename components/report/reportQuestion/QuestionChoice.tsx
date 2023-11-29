import { StyledButton } from "@/components/layout/BackOfficeLayout";
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledDivHeader,
} from "@/components/styledComponents/StyledContainer";
import { Option, Question } from "@/pages/reports/types/[animal]";
import { types } from "@/pages/reports/types/[animal]/versions/[version]/questions/[question]";
import { TextField, Typography } from "@mui/material";
import React from "react";

interface AnswerTypeProps {
  published: boolean;
  question: Question;
  handleChangeOptions: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const QuestionChoice = ({
  published,
  question,
  handleChangeOptions,
  handleNewOption,
  handleDeleteOption,
}: AnswerTypeProps) => {
  switch (question.type) {
    case "DATETIME":
    case "LOCATION":
    case "FILE":
    case "SHORT_ANSWER":
    case "LONG_ANSWER":
      return (
        <StyledContainerOne style={{ alignItems: "center" }}>
          <Typography variant="body1">
            {types[question.type]} 질문은 수정하실 수 없습니다.
          </Typography>
        </StyledContainerOne>
      );
    //   return (
    //     <StyledContainerThree
    //     style={{
    //       margin: "0",
    //     }}
    //   >
    //     <Typography variant="body1">라벨</Typography>
    //     <TextField
    //       variant="standard"
    //       name={"label"}
    //       value={question.label}
    //       onChange={handleChange}
    //     />
    //   </StyledContainerThree>
    //   )
    case "MULTIPLE_CHOICE(SINGLE)":
    case "MULTIPLE_CHOICE(MULTI)":
      return (
        <React.Fragment>
          {question.options.map((option, index) => (
            <StyledDivHeader key={index}>
              <StyledContainerThree
                style={{
                  margin: "0",
                  width: "50%",
                }}
              >
                <Typography variant="body1">보기 {index + 1}</Typography>
                <TextField
                  variant="standard"
                  name={`${index}`}
                  value={option.value}
                  onChange={handleChangeOptions}
                  disabled={published}
                />
              </StyledContainerThree>

              <StyledButton
                sx={{ marginLeft: "auto" }}
                color="info"
                name={`${index}`}
                onClick={handleDeleteOption}
                disabled={published}
              >
                삭제
              </StyledButton>
            </StyledDivHeader>
          ))}
          <StyledButton
            onClick={handleNewOption}
            sx={{ width: "50%" }}
            color="info"
            disabled={published}
          >
            항목 추가하기
          </StyledButton>
        </React.Fragment>
      );
    default:
      return <></>;
  }
};

export { QuestionChoice };
