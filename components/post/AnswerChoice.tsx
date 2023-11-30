import React, { useMemo } from "react";

import { CheckboxAnswer } from "./options/CheckboxAnswer";
import { DateAnswer } from "./options/DateAnswer";
import ImageAnswer from "./options/ImageAnswer";
import { LocationAnswer } from "./options/LocationAnswer";
import { RadioAnswer } from "./options/RadioAnswer";
import { ShortAnswer } from "./options/ShortAnswer";
import { Option } from "@/pages/reports/types/[animal]";

export type AnswerType =
  | TextAnswerType
  | ImageAnswerType
  | LocationAnswerType
  | DateTimeAnswerType;

interface CommonAnswerType {
  type: string;
  questionId: number;
  question?: { id: number }; //only for specific report response
  modified?: boolean; //only for checking modifications
}

export interface TextAnswerType extends CommonAnswerType {
  value: string;
}

export interface ImageAnswerType extends CommonAnswerType {
  value: {
    fileType: string; //example: "IMAGE"
    fileKey: string; //example: "image1"
    fileUrl?: File | string;
  };
  file?: File;
}

export interface LocationAnswerType extends CommonAnswerType {
  value: {
    latitude: number;
    longitude: number;
    address: string;
    addressDetail: string;
  };
}

export interface DateTimeAnswerType extends CommonAnswerType {
  value: Date | string | null; //fix later :(
}

export type UpdateAnswersType = (newAnswers: AnswerType[]) => void;

export type currentAnswerType = AnswerType[];

export interface SingleAnswerProps {
  currentAnswer: AnswerType;
  updateAnswers: UpdateAnswersType;
}

interface AnswerTypeProps {
  currentAnswer: currentAnswerType;
  updateAnswers: UpdateAnswersType;
  options: Option[];
  questionType: string;
}

const AnswerChoice: React.FC<AnswerTypeProps> = React.memo(
  ({ currentAnswer, updateAnswers, options, questionType }) => {
    const firstCurrentAnswer = useMemo(() => currentAnswer[0], [currentAnswer]);

    switch (questionType) {
      case "DATETIME":
        return (
          <DateAnswer
            currentAnswer={firstCurrentAnswer as DateTimeAnswerType}
            updateAnswers={updateAnswers}
          />
        );
      case "LOCATION":
        return (
          <LocationAnswer
            currentAnswer={firstCurrentAnswer as LocationAnswerType}
            updateAnswers={updateAnswers}
          />
        );
      case "IMAGE":
      case "FILE":
        return (
          <ImageAnswer
            currentAnswer={currentAnswer as ImageAnswerType[]}
            updateAnswers={updateAnswers}
          />
        );
      case "SHORT_ANSWER":
      case "LONG_ANSWER":
        return (
          <ShortAnswer
            currentAnswer={firstCurrentAnswer as TextAnswerType}
            updateAnswers={updateAnswers}
          />
        );

      case "MULTIPLE_CHOICE(SINGLE)":
        return (
          <RadioAnswer
            currentAnswer={firstCurrentAnswer as TextAnswerType}
            updateAnswers={updateAnswers}
            options={options}
          />
        );
      case "MULTIPLE_CHOICE(MULTI)":
        return (
          <CheckboxAnswer
            currentAnswer={currentAnswer as TextAnswerType[]}
            updateAnswers={updateAnswers}
            options={options}
          />
        );
      default:
        return <></>;
    }
  }
);

AnswerChoice.displayName = "AnswerChoice";

export { AnswerChoice };
