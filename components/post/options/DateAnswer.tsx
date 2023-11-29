import "dayjs/locale/ko";

import { FormControl } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";

import {
  DateTimeAnswerType,
  UpdateAnswersType,
} from "@/components/post/AnswerChoice";
import { StyledContainerTwo } from "@/components/styledComponents/StyledContainer";

interface DateAnswerProps {
  currentAnswer: DateTimeAnswerType;
  updateAnswers: UpdateAnswersType;
}

const DateAnswer: React.FC<DateAnswerProps> = React.memo(
  ({ currentAnswer, updateAnswers }) => {
    console.log(currentAnswer);
    return (
      <FormControl fullWidth>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <StyledContainerTwo>
            <DateTimePicker
              label="날짜"
              value={currentAnswer ? dayjs(currentAnswer.value) : null}
              onChange={(newValue: dayjs.Dayjs) => {
                updateAnswers([
                  {
                    ...currentAnswer,
                    value: newValue
                      ? newValue.format("YYYY-MM-DD HH:mm")
                      : null,
                    modified: true,
                  },
                ]);
              }}
              // minutesStep={30}
              timeSteps={{ minutes: 30 }}
              slotProps={{
                textField: { variant: "standard" },
                popper: { disablePortal: true },
              }}
              views={["year", "month", "day", "hours", "minutes"]}
            />
          </StyledContainerTwo>
        </LocalizationProvider>
      </FormControl>
    );
  }
);

DateAnswer.displayName = "DateAnswer";

export { DateAnswer };
