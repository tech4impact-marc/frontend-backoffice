import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { TextAnswerType, UpdateAnswersType } from "../AnswerChoice";
import { Option } from "@/pages/reports/types/[animal]";

interface MultipleAnswerProps {
  currentAnswer: TextAnswerType;
  updateAnswers: UpdateAnswersType;
  options: Option[];
}

export const RadioAnswer: React.FC<MultipleAnswerProps> = ({
  currentAnswer,
  updateAnswers,
  options,
}) => {
  const [other, setOther] = useState("");

  useEffect(() => {
    if (currentAnswer.value.includes("기타:")) {
      setOther(currentAnswer.value.split(": ")[1]);
    } else {
      setOther("");
    }
  }, [currentAnswer.value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAnswers([
      { ...currentAnswer, value: e?.target?.value, modified: true },
    ]);
    if (e?.target?.value !== "기타") {
      setOther("");
    }
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOther(e?.target?.value);
    updateAnswers([
      {
        ...currentAnswer,
        value: "기타: " + e?.target?.value,
        modified: true,
      },
    ]);
  };

  return (
    <FormControl fullWidth>
      <RadioGroup
        value={
          currentAnswer.value.includes("기타") ? "기타" : currentAnswer.value
        }
        onChange={handleTextChange}
        style={{ position: "relative" }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={<Radio value={option.value} onChange={handleTextChange} />}
            label={
              option.value == "기타" ? (
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ width: "100%", display: "flex", alignItems: "center" }}
                >
                  <Typography
                    variant="body1"
                    style={{ marginRight: "10px", flexShrink: "0" }}
                  >
                    기타:
                  </Typography>
                  <TextField
                    variant="standard"
                    value={other}
                    onChange={handleOtherTextChange}
                    fullWidth
                  />
                </Typography>
              ) : (
                option.value
              )
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
