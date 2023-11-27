import { Button, Container, TextField, Typography } from "@mui/material";
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
} from "@/components/styledComponents/StyledContainer";
import Image from "next/image";
import BasicTable from "@/components/styledComponents/StyledTable2";
import { GetServerSideProps } from "next";

export interface ReportTypeSimpleResponseDto {
  title: string;
  subtitle: string;
  description: string;
}

export interface Question {
  id: number;
  questionNumber: number;
  title: string;
  type: string;
  required: boolean;
  isMain: boolean;
  options: Option[];
}

export interface Option {
  id: number;
  answerNumber: number;
  value: string;
}

const BackOfficeForm = ({
  responseType,
}: {
  responseType: ReportTypeSimpleResponseDto;
}) => {
  const router = useRouter();
  const selectedAnimal = useMemo(
    () => parseInt(router.query.animal as string),
    [router.query.animal]
  );
  const [responseType, setResponseType] = useState<ReportTypeSimpleResponseDto>(
    {
      title: "",
      subtitle: "",
      description: "",
    }
  );
  const [updates, setUpdates] = useState<number>(0);
  console.log(tmp);

  useEffect(() => {
    if (!selectedAnimal) {
      return;
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}` // admin용은 없어...
      )
      .then((response) => {
        setResponseType({
          title: response.data.title,
          subtitle: response.data.subtitle,
          description: response.data.description,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });

    axios
      .get(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${selectedAnimal}/versions` // admin용은 없어...
      )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [selectedAnimal, updates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResponseType((prevState) => {
      return {
        ...prevState,
        [name as keyof ReportTypeSimpleResponseDto]: value,
      };
    });
    setUpdates(1);
  };

  const handleSubmit = () => {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${selectedAnimal}`,
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
    setUpdates(0);
  };

  return (
    <React.Fragment>
      {responseType && (
        <React.Fragment>
          <StyledContainerOne
            style={{
              backgroundColor: "white",
              rowGap: "1.5rem",
              height: "auto",
              justifyContent: "start",
            }}
          >
            <div
              style={{ width: "100%", display: "flex", alignItems: "center" }}
            >
              <Typography variant="h2">리포트 정보</Typography>
              <StyledButton
                onClick={handleSubmit}
                sx={{ marginLeft: "auto" }}
                disabled={updates == 0}
              >
                변경사항 저장하기
              </StyledButton>
            </div>

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
                  src="/marc_logo.png"
                  alt={"logo"}
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
                  value={responseType.title}
                  onChange={handleChange}
                />
              </StyledContainerThree>
              <StyledContainerThree>
                <Typography variant="body1">부제목</Typography>
                <TextField
                  variant="standard"
                  name={"subtitle"}
                  value={responseType.subtitle}
                  onChange={handleChange}
                />
              </StyledContainerThree>
              <StyledContainerThree>
                <Typography variant="body1">비고</Typography>
                <TextField
                  variant="standard"
                  name={"description"}
                  value={responseType.description}
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
            <Typography variant="h2">리포트 버전</Typography>
            <BasicTable />
          </StyledContainerOne>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default BackOfficeForm;

BackOfficeForm.getLayout = (page: ReactElement) => (
  <BackOfficeLayout>{page}</BackOfficeLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const selectedAnimal = context.query.animal;

  const reportTypeResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_IP_ADDRESS}/reports/types/${selectedAnimal}`
  );
  const responseType: ReportTypeSimpleResponseDto =
    await reportTypeResponse.data;
  return { props: { responseType } };
};