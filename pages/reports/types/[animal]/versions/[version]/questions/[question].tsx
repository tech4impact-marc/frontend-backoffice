import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useState } from "react";
import React from "react";

import ReportQuestions from "@/components/report/ReportQuestions";
import ReportType from "@/components/report/ReportType";
import BackOfficeLayout, {
  StyledButton,
} from "@/components/layout/BackOfficeLayout";
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledDivHeader,
} from "@/components/styledComponents/StyledContainer";
import { GetServerSideProps } from "next";
import { Option, Question } from "../../..";
import { QuestionChoice } from "@/components/report/reportQuestion/QuestionChoice";

export const types = {
  SHORT_ANSWER: "단답형",
  LONG_ANSWER: "장문형",
  "MULTIPLE_CHOICE(SINGLE)": "객관식",
  "MULTIPLE_CHOICE(MULTI)": "복수 응답",
  DATETIME: "날짜/시간",
  LOCATION: "장소",
  FILE: "파일",
  IMAGE: "이미지",
};

const BackOfficeForm = ({
  question,
  published,
}: {
  question: Question;
  published: boolean;
}) => {
  const router = useRouter();
  const { query } = router;
  const [localQuestion, setLocalQuestion] = useState<Question>(question);
  const [updates, setUpdates] = useState<number>(0);
  console.log(question);

  const handleChangeOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLocalQuestion((prevState) => {
      const updatedOptions = prevState.options.map((option, index) => {
        if (index.toString() === name) {
          return {
            ...option,
            value: value,
          };
        }
        return option;
      });
      return {
        ...prevState,
        options: updatedOptions,
      };
    });
    setUpdates(1);
  };

  const handleNewOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOption: Option = {
      answerOrder: localQuestion.options.length + 1,
      value: "",
    };
    console.log(newOption);

    setLocalQuestion((prevState) => {
      return {
        ...prevState,
        options: [...prevState.options, newOption],
      };
    });
    setUpdates(1);
  };

  const handleDeleteOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalQuestion((prevState) => {
      let updatedOptions = prevState.options;
      updatedOptions.splice(parseInt(name), 1);
      return {
        ...prevState,
        options: updatedOptions,
      };
    });
    setUpdates(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalQuestion((prevState) => {
      return {
        ...prevState,
        [name as keyof Question]: value,
      };
    });
    setUpdates(1);
  };

  const handleSubmit = () => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${query.animal}/versions/${query.version}/questions/${query.question}`,
        localQuestion
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          alert("변경사항이 저장되었습니다");
          setUpdates(0);
        } else {
          console.log(response);
          alert("오류가 있었습니다");
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert("오류가 있었습니다");
      });
  };

  if (!localQuestion) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <StyledContainerOne
      style={{
        backgroundColor: "white",
        rowGap: "1.5rem",
        height: "auto",
        justifyContent: "start",
      }}
    >
      <StyledDivHeader>
        <Typography variant="h2">질문 정보</Typography>
        <StyledButton
          onClick={handleSubmit}
          sx={{ marginLeft: "auto" }}
          disabled={updates == 0 || published}
        >
          변경사항 저장하기
        </StyledButton>
      </StyledDivHeader>

      <StyledDivHeader style={{ gap: "2rem" }}>
        <Typography variant="button">필수 질문</Typography>
        <Switch
          checked={localQuestion.required}
          name={"required"}
          onClick={() => {
            setLocalQuestion((prevLocalQuestion) => ({
              ...prevLocalQuestion,
              required: !localQuestion.required,
            }));
            setUpdates(1);
          }}
          disabled={published || localQuestion.isMain}
        />
      </StyledDivHeader>

      <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
        <StyledContainerThree style={{ flex: "4" }}>
          <Typography variant="body1">질문 타입</Typography>
          <FormControl variant="standard">
            <Select
              name="type"
              value={localQuestion.type}
              onChange={handleChange}
              label="Age"
              disabled={published || localQuestion.isMain}
            >
              {Object.keys(types).map((type, index) => (
                <MenuItem key={index} value={type}>
                  {types[type as keyof typeof types]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </StyledContainerThree>

        <StyledContainerThree style={{ flex: "4" }}>
          <Typography variant="body1">질문 제목</Typography>
          <TextField
            variant="standard"
            name={"title"}
            value={localQuestion.title}
            onChange={handleChange}
            disabled={published || localQuestion.isMain}
          />
        </StyledContainerThree>
      </div>
      <StyledDivHeader>
        <Typography variant="h2">질문 타입</Typography>
      </StyledDivHeader>
      <StyledContainerThree style={{ width: "100%" }}>
        <Typography variant="body1">질문 설명</Typography>
        <TextField
          variant="standard"
          name={"description"}
          value={localQuestion.description}
          onChange={handleChange}
          disabled={published || localQuestion.isMain}
          // sx={{ height: "4rem !important" }}
          // InputProps={{
          //   style: {
          //     height: "4rem !important",
          //   },
          // }}
          // rows={2}
          // multiline
        />
      </StyledContainerThree>

      <StyledDivHeader>
        <Typography variant="h2">질문 내용</Typography>
      </StyledDivHeader>
      <QuestionChoice
        published={published}
        question={localQuestion}
        handleChangeOptions={handleChangeOptions}
        handleNewOption={handleNewOption}
        handleDeleteOption={handleDeleteOption}
      />
    </StyledContainerOne>
  );
};

export default BackOfficeForm;

BackOfficeForm.getLayout = (page: ReactElement) => (
  <BackOfficeLayout>{page}</BackOfficeLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const selectedAnimal = context.query.animal;
  const selectedVersion = context.query.version;
  const selectedQuestion = context.query.question;

  try {
    const reportTypeVersionResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${selectedAnimal}/versions/${selectedVersion}`
    );
    const question = await reportTypeVersionResponse.data.questions.find(
      (question: Question) => question.id.toString() === selectedQuestion
    );
    const published = await reportTypeVersionResponse.data.published;

    return { props: { question, published } };
  } catch {
    console.log("There was an error");
  }

  return { props: {} };
};
