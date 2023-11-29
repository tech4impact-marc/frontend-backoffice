import { Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useState } from "react";
import React from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import BackOfficeLayout, {
  StyledButton,
} from "@/components/layout/BackOfficeLayout";
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledDivHeader,
} from "@/components/styledComponents/StyledContainer";
import Image from "next/image";
import { BasicTable } from "@/components/styledComponents/StyledTable2";
import { GetServerSideProps } from "next";
import { Animal } from "..";

export interface ReportTypeVersionSimpleResponseDto {
  id: number;
  versionNumber: number;
  published: boolean;
  publishedDateTime: Date;
  createdDateTime: Date;
  modifiedDateTime: Date;
  questions: Question[];
}

export interface ReportTypeVersionsResponseDto {
  isEmpty: boolean;
  numberOfElements: number;
  contents: ReportTypeVersionSimpleResponseDto[];
}

export interface Question {
  id: number;
  questionOrder: number;
  title: string;
  description: string;
  modifiedDateTime: Date;
  type: string;
  required: boolean;
  isMain: boolean;
  options: Option[];
}

export interface Option {
  id?: number;
  answerOrder: number;
  value: string;
}

const BackOfficeForm = ({
  reportType,
  reportTypeVersion,
}: {
  reportType: Animal;
  reportTypeVersion: ReportTypeVersionsResponseDto;
}) => {
  const router = useRouter();
  const selectedAnimal = useMemo(
    () => parseInt(router.query.animal as string),
    [router.query.animal]
  );
  const [localResponseType, setLocalResponseType] =
    useState<Animal>(reportType);
  const [updates, setUpdates] = useState<number>(0);
  console.log(reportType, reportTypeVersion);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalResponseType((prevState) => {
      return {
        ...prevState,
        [name as keyof Animal]: value,
      };
    });
    setUpdates(1);
  };

  const handleSubmit = () => {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${selectedAnimal}`,
        localResponseType
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
    setUpdates(0);
  };

  const handleNewVersion = async () => {
    const newAnimal = reportType.subject;
    const initData = {
      label: newAnimal,
      subject: newAnimal,
      title: `${newAnimal} 설문지`,
      subtitle: `${newAnimal} 분포 및 서식 조사`,
      description: `${newAnimal} 서포터즈로 참여하신 여러분께 감사드립니다.\n 여러분의 관찰 기록을 바탕으로 제주 ${newAnimal}의 분포 및 생태를 파악하고, 보전자료로 활용하고자 합니다.`,
      memo: `${newAnimal} 설문지 첫 버전`,
    };
    const initVersionData = {
      ...initData,
      questions: [
        {
          questionOrder: 1,
          title: "사진을 첨부해주세요",
          description: "발견하신 바다 사진만 있어도 괜찮아요",
          type: "FILE",
          required: true,
          isMain: true,
        },
        {
          questionOrder: 2,
          title: `언제 ${newAnimal}를 보셨나요?`,
          description:
            "이미 작성되어 있다면, 업로드해주신 사진을 바탕으로 작성되었어요",
          type: "DATETIME",
          required: true,
          isMain: true,
        },
        {
          questionOrder: 3,
          title: `어디서 ${newAnimal}를 보셨나요?`,
          description:
            "이미 작성되어 있다면, 업로드해주신 사진을 바탕으로 작성되었어요",
          type: "LOCATION",
          required: true,
          isMain: true,
        },
      ],
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${selectedAnimal}/versions`,
        initVersionData
      )
      .then((response) => {
        console.log(response);
        window.location.reload();
        // router.push(`/reports/types/${reportTypeId}/versions/${response.id}`);
      })
      .catch((error) => {
        console.log("오류가 있었습니다!");
      });
  };

  if (!localResponseType || !reportTypeVersion) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <React.Fragment>
      <React.Fragment>
        <StyledContainerOne
          style={{
            backgroundColor: "white",
            rowGap: "1.5rem",
            height: "auto",
            justifyContent: "start",
          }}
        >
          <StyledDivHeader>
            <Typography variant="h2">리포트 정보</Typography>
            <StyledButton
              onClick={handleSubmit}
              sx={{ marginLeft: "auto" }}
              disabled={updates == 0}
            >
              변경사항 저장하기
            </StyledButton>
          </StyledDivHeader>

          <StyledContainerThree style={{ width: "100%", margin: "0" }}>
            <Typography variant="body1">아이콘</Typography>
            <div
              style={{
                borderRadius: "1rem",
                border: "1px dashed var(--Gray, #9AA8BF)",
                display: "flex",
                width: "7.5rem",
                height: " 7.5rem",
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={
                  localResponseType.thumbnailUrl
                    ? localResponseType.thumbnailUrl
                    : "/marc_logo.png"
                }
                alt={"animal icon"}
                width={80}
                height={80}
              />
            </div>
          </StyledContainerThree>

          <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
            <StyledContainerThree>
              <Typography variant="body1">제목</Typography>
              <TextField
                variant="standard"
                name={"title"}
                value={localResponseType.title}
                onChange={handleChange}
              />
            </StyledContainerThree>
            <StyledContainerThree>
              <Typography variant="body1">부제목</Typography>
              <TextField
                variant="standard"
                name={"subtitle"}
                value={localResponseType.subtitle}
                onChange={handleChange}
              />
            </StyledContainerThree>
            <StyledContainerThree>
              <Typography variant="body1">비고</Typography>
              <TextField
                variant="standard"
                name={"description"}
                value={localResponseType.description}
                onChange={handleChange}
              />
            </StyledContainerThree>
          </div>
        </StyledContainerOne>

        <StyledContainerOne
          style={{
            backgroundColor: "white",
            rowGap: "1.5rem",
            height: "auto",
            justifyContent: "start",
          }}
        >
          <StyledDivHeader>
            <Typography variant="h2">리포트 버전</Typography>
            <StyledButton
              onClick={handleNewVersion}
              sx={{ marginLeft: "auto" }}
              disabled={reportTypeVersion.contents.some(
                (reportVersion) => reportVersion.published !== true
              )}
              startIcon={<AddRoundedIcon />}
            >
              새 버전 만들기
            </StyledButton>
          </StyledDivHeader>
          <BasicTable reportTypeVersion={reportTypeVersion} />
        </StyledContainerOne>
      </React.Fragment>
    </React.Fragment>
  );
};

export default BackOfficeForm;

BackOfficeForm.getLayout = (page: ReactElement) => (
  <BackOfficeLayout>{page}</BackOfficeLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const setOrigin = {
    headers: {
      Origin: `${process.env.NEXT_PUBLIC_FRONT_URL}`,
    },
  };
  const selectedAnimal = context.query.animal;

  try {
    const reportTypeResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}`,
      setOrigin
    );
    const reportType: Animal = await reportTypeResponse.data;

    const reportTypeVersionResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${selectedAnimal}/versions`,
      setOrigin
    );
    const reportTypeVersion = await reportTypeVersionResponse.data;

    return { props: { reportType, reportTypeVersion } };
  } catch (error) {
    return { props: {} };
  }
};
