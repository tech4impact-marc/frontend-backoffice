import { TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

import { StyledButton } from "@/components/layout/BackOfficeLayout";
import {
  StyledContainerOne,
  StyledContainerThree,
} from "@/components/styledComponents/StyledContainer";
import { ReportTypeSimpleResponseDto } from "@/pages/report/[animal]";

interface ReportTypeProps {
  selectedAnimal: number;
  responseType: ReportTypeSimpleResponseDto;
  setResponseType: (
    value: React.SetStateAction<ReportTypeSimpleResponseDto>
  ) => void;
}

const ReportType: React.FC<ReportTypeProps> = ({
  selectedAnimal,
  responseType,
  setResponseType,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponseType((prevResponseType) => ({
      ...prevResponseType,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = () => {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}`,
        responseType
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
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
  };

  const router = useRouter();

  const handleDelete = () => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}`
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          alert("설문이 삭제되었습니다");
          router.push(`/report`);
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
    <StyledContainerOne
      style={{ backgroundColor: "white", rowGap: "1.5rem", height: "auto" }}
    >
      <Typography variant="h2">리포트 정보</Typography>

      <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
        <StyledContainerThree>
          <Typography variant="body1">제목</Typography>
          <TextField
            variant="outlined"
            name={"title"}
            value={responseType.title}
            onChange={handleChange}
          />
        </StyledContainerThree>
        <StyledContainerThree>
          <Typography variant="body1">부제목</Typography>
          <TextField
            variant="outlined"
            name={"subtitle"}
            value={responseType.subtitle}
            onChange={handleChange}
          />
        </StyledContainerThree>
      </div>
      <StyledContainerThree style={{ minWidth: "100%" }}>
        <Typography variant="body1">비고</Typography>
        <TextField
          variant="outlined"
          name={"description"}
          value={responseType.description}
          onChange={handleChange}
        />
      </StyledContainerThree>
      <div style={{ marginLeft: "auto", display: "flex", columnGap: "1rem" }}>
        <StyledButton
          variant="contained"
          color="warning"
          onClick={handleDelete}
          disableElevation
        >
          리포트 삭제하기
        </StyledButton>
        <StyledButton
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disableElevation
        >
          저장하기
        </StyledButton>
      </div>
    </StyledContainerOne>
  );
};

export default ReportType;
