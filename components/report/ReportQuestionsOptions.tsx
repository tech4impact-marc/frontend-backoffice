import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import { IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";

import { StyledButton } from "@/components/layout/BackOfficeLayout";
import { Option, Question } from "@/pages/report/[animal]";

const ReportQuestionsOptions = ({
  selectedAnimal,
  options,
  question,
  setUpdates,
  updateOptions,
}: {
  selectedAnimal: number;
  options: Option[];
  question: Question;
  setUpdates: () => void;
  updateOptions: (id: number, value?: string | Option, action?: string) => void;
}) => {
  function handleDeleteOption(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}/questions/${question.id}/options/${id}`
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          setUpdates();
          updateOptions(id, undefined, "DELETE");
          alert("옵션이 삭제되었습니다");
        } else {
          console.log(response);
          alert("오류가 있었습니다");
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert("오류가 있었습니다");
      });
  }

  function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) {
    const currentOption = options.find((option) => option.id == id);
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}/questions/${question.id}/options/${id}`,
        currentOption
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          setUpdates();
          alert("변경사항이 저장되었습니다");
        } else {
          console.log(response);
          alert("오류가 있었습니다");
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert("오류가 있었습니다");
      });
  }

  const handleNewOption = () => {
    const initData = {
      answerNumber: options.length + 1,
      value: "",
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}/questions/${question.id}/options`,
        initData
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          updateOptions(response.data.id, response.data, "CREATE");
          alert("옵션이 추가되었습니다");
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

  return (
    <React.Fragment>
      <Typography variant="h2">답변</Typography>
      {question.options.map((option, index) => (
        <div
          key={index}
          style={{ display: "flex", width: "100%", columnGap: "1rem" }}
        >
          <TextField
            value={option.value}
            style={{ flex: "9" }}
            onChange={(e) => updateOptions(option.id, e.target.value)}
          />
          <StyledButton
            variant="contained"
            onClick={(e) => handleSubmit(e, option.id)}
            disableElevation
          >
            저장하기
          </StyledButton>

          <IconButton
            aria-label="delete"
            style={{ width: "3rem" }}
            onClick={(e) => handleDeleteOption(e, option.id)}
          >
            <DeleteOutlineSharpIcon />
          </IconButton>
        </div>
      ))}
      <StyledButton
        variant="contained"
        onClick={handleNewOption}
        disableElevation
      >
        <AddRoundedIcon />
      </StyledButton>
    </React.Fragment>
  );
};

export default ReportQuestionsOptions;
