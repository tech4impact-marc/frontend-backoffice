import "dayjs/locale/ko";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React, { useState } from "react";

import {
  AnswerType,
  TextAnswerType,
  UpdateAnswersType,
} from "@/components/post/AnswerChoice";
import { Option } from "@/pages/reports/types/[animal]";

interface MultipleAnswerProps {
  currentAnswer: TextAnswerType[];
  updateAnswers: UpdateAnswersType;
  options: Option[];
}

export const CheckboxAnswer: React.FC<MultipleAnswerProps> = ({
  currentAnswer,
  updateAnswers,
  options,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<(AnswerType | null)[]>(
    options.map((option) =>
      currentAnswer.some(
        (currentAnswer) => currentAnswer.value === option.value
      )
        ? {
            type: currentAnswer[0].type,
            questionId: currentAnswer[0].questionId,
            value: option.value,
            modified: true,
          }
        : null
    )
  );

  const handleTextChange = (index: number) => {
    let newSelectedOptions: (AnswerType | null)[] = [];
    setSelectedOptions((prevSelectedOptions) => {
      newSelectedOptions = [...prevSelectedOptions];
      if (newSelectedOptions[index] === null) {
        newSelectedOptions[index] = {
          type: currentAnswer[0].type,
          questionId: currentAnswer[0].questionId,
          value: options[index].value,
          modified: true,
        };
      } else {
        newSelectedOptions[index] = null;
      }
      return newSelectedOptions;
    });
    updateAnswers(
      newSelectedOptions.filter((option) => option !== null) as AnswerType[]
    );
  };

  return (
    <FormControl fullWidth>
      <FormGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                value={option.value}
                onChange={() => handleTextChange(index)}
                checked={selectedOptions[index] !== null}
              />
            }
            label={option.value}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};
