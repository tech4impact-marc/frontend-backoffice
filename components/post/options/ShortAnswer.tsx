import { FormControl, TextField } from "@mui/material";
import React from "react";

import {
  TextAnswerType,
  UpdateAnswersType,
} from "@/components/post/AnswerChoice";

interface ShortAnswerProps {
  currentAnswer: TextAnswerType;
  updateAnswers: UpdateAnswersType;
}

export const ShortAnswer: React.FC<ShortAnswerProps> = ({
  currentAnswer,
  updateAnswers,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAnswers([
      { ...currentAnswer, value: e?.target?.value, modified: true },
    ]);
  };

  return (
    <FormControl fullWidth>
      <TextField
        placeholder="입력해주세요"
        variant="standard"
        value={currentAnswer.value ? currentAnswer.value : ""} //null issue
        onChange={handleTextChange}
        inputProps={{
          "aria-label": "weight",
        }}
      />
    </FormControl>
  );
};
