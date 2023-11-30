import "dayjs/locale/ko";

import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Button, FormControl, TextField, Typography } from "@mui/material";
import Script from "next/script";
import React, { useState } from "react";

import {
  LocationAnswerType,
  UpdateAnswersType,
} from "@/components/post/AnswerChoice";
import { StyledContainerThree } from "@/components/styledComponents/StyledContainer";

interface LocationAnswerProps {
  currentAnswer: LocationAnswerType;
  updateAnswers: UpdateAnswersType;
}

export const LocationAnswer: React.FC<LocationAnswerProps> = ({
  currentAnswer,
  updateAnswers,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedLocation: LocationAnswerType = {
      ...currentAnswer,
      value: {
        ...(currentAnswer.value as LocationAnswerType["value"]),
        [name]: value,
      },
      modified: true,
    };
    updateAnswers([updatedLocation]);
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          columnGap: "1rem",
          width: "100%",
        }}
      >
        <StyledContainerThree>
          <Typography variant="subtitle1">위치</Typography>
          <TextField
            variant="standard"
            value={
              currentAnswer.value.address ? currentAnswer.value.address : ""
            } //null issue
            name="address"
            onChange={handleTextChange}
            fullWidth
            required
          />
        </StyledContainerThree>
        <StyledContainerThree>
          <Typography variant="subtitle1">상세 위치</Typography>
          <TextField
            variant="standard"
            value={
              currentAnswer.value.addressDetail
                ? currentAnswer.value.addressDetail
                : ""
            } //null issue
            name="addressDetail"
            onChange={handleTextChange}
            fullWidth
          />
        </StyledContainerThree>
      </div>
      <div
        style={{
          display: "flex",
          columnGap: "1rem",
          width: "100%",
        }}
      >
        <StyledContainerThree>
          <Typography variant="subtitle1">위도</Typography>
          <TextField
            variant="standard"
            // label="위치"
            value={currentAnswer.value.latitude}
            name="latitude"
            onChange={handleTextChange}
            fullWidth
            required
          />
        </StyledContainerThree>
        <StyledContainerThree>
          <Typography variant="subtitle1">경도</Typography>
          <TextField
            variant="standard"
            // label="상세 위치"
            value={currentAnswer.value.longitude}
            name="longitude"
            onChange={handleTextChange}
            fullWidth
          />
        </StyledContainerThree>
      </div>
    </React.Fragment>
  );
};
