import axios from "axios";
import { GetServerSideProps } from "next";
import { ReportTypeVersionSimpleResponseDto } from "../..";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledDivHeader,
} from "@/components/styledComponents/StyledContainer";
import { Tab, Tabs, TextField, Typography, styled } from "@mui/material";
import { StyledButton } from "@/components/layout/BackOfficeLayout";
import theme from "@/styles/theme";
import { BasicDragQuestionsTable } from "@/components/styledComponents/QuestionTable/Table";
import { error } from "console";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  DownloadCSV,
  ReportResponseTable,
  responseToCsvData,
} from "@/components/styledComponents/ReportResponseTable";

interface ReportDto {
  id: number;
  createdDateTime: Date;
  modifiedDateTime: Date;
  question: {
    id?: number;
    title?: string | null;
    questionOrder: number;
    type?: string;
  };
  isMain: boolean;
}

export interface ReportResponseDto {
  totalNumberOfPages: 0;
  totalNumberOfElements: 0;
  first: true;
  last: true;
  isEmpty: true;
  numberOfElements: 0;
  contents: ReportDto[];
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    height: "3px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    height: "3px",
    backgroundColor: "#000",
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(() => ({
  textTransform: "none",
  minWidth: 0,
  [theme.breakpoints.up("sm")]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.button.fontWeight,
  marginRight: theme.spacing(0),
  color: "#D3D6DA",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    color: "#888",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#000",
    fontWeight: theme.typography.button.fontWeight,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#000",
  },
}));

const ReportVersion = ({
  reportTypeVersion,
  reports,
}: {
  reportTypeVersion: ReportTypeVersionSimpleResponseDto;
  reports: ReportResponseDto;
}) => {
  if (!reportTypeVersion || !reports) {
    return <React.Fragment></React.Fragment>;
  }

  const { data: csvData, headers: csvHeaders } = useMemo(
    () => responseToCsvData(reportTypeVersion.questions, reports.contents),
    []
  );

  const router = useRouter();
  const { pathname, query } = router;

  const [tab, setTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handlePublish = async () => {
    try {
      const publishResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${query.animal}/versions/${query.version}/publish`
      );
      if (publishResponse.status === 200) {
        const copyResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${query.animal}/versions/${query.version}/duplicate`
        );
        if (copyResponse.status === 200) {
          alert("성공적으로 배포했습니다.");
          window.location.reload();
        } else {
          console.log("오류가 있었습니다.");
        }
      } else {
        console.log("오류가 있었습니다.");
      }
    } catch (error) {
      console.log("오류가 있었습니다.");
    }
  };

  const handleNewOrder = ({
    data,
  }: {
    data: { type: string; orders: number[] };
  }) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${query.animal}/versions/${query.version}/questions/order`,
        data
      )
      .then((response) => {
        if (response.status !== 200) {
          alert("오류가 있었습니다.");
        } else {
          alert("순서가 성공적으로 변경되었습니다.");
        }
      })
      .catch((error) => {
        alert("오류가 있었습니다.");
      });
  };

  const handleNewQuestion = () => {
    const questionOrder =
      Math.max(
        ...reportTypeVersion.questions.map((question) => question.questionOrder)
      ) + 1;

    const initQuestion = {
      type: "MULTIPLE_CHOICE(SINGLE)",
      required: false,
      isMain: false,
      questionOrder: questionOrder,
      title: `질문 ${questionOrder} 제목`,
      description: `질문 ${questionOrder} 설명`,
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${query.animal}/versions/${query.version}/questions`,
        initQuestion
      )
      .then((response) => {
        if (response.status !== 200) {
          alert("오류가 있었습니다.");
        } else {
          window.location.reload();
          // router.push(
          //   `/reports/types/${query.animal}/versions/${query.version}/questions/${response.data.id}`
          // );
          // router.push(
          //   `/reports/types/${query.animal}/versions/${query.version}`
          // );
        }
      })
      .catch((error) => {
        alert("오류가 있었습니다.");
      });
  };

  return (
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
          <Typography variant="h2">리포트 버전 정보</Typography>
          <StyledButton
            onClick={handlePublish}
            sx={{ marginLeft: "auto" }}
            disabled={reportTypeVersion.published}
          >
            {/* {reportTypeVersion.published ? "복제하기" : "배포하기"} */}
            배포하기
          </StyledButton>
        </StyledDivHeader>

        {/* <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}> */}
        <StyledContainerThree style={{ flex: "1" }}>
          <Typography variant="body1">버전</Typography>
          <TextField
            variant="standard"
            name={"title"}
            value={`V${reportTypeVersion.versionNumber}`}
            disabled
          />
        </StyledContainerThree>
        {/* <StyledContainerThree style={{ flex: "5" }}>
            <Typography variant="body1">메모</Typography>
            <TextField
              variant="standard"
              name={"subtitle"}
              value={"MEMO가 없다..?"}
              disabled
            />
          </StyledContainerThree>
        </div> */}
      </StyledContainerOne>

      <StyledContainerOne style={{ padding: "0" }}>
        <StyledTabs value={tab} onChange={handleTabChange}>
          <StyledTab label="질문" />
          {reportTypeVersion.published && <StyledTab label="응답" />}
        </StyledTabs>
      </StyledContainerOne>
      {tab == 0 && (
        <StyledContainerOne
          style={{
            backgroundColor: "white",
            rowGap: "1.5rem",
            height: "auto",
            justifyContent: "start",
          }}
        >
          <StyledDivHeader>
            <Typography variant="h2">질문 목록</Typography>
            <StyledButton
              onClick={handleNewQuestion}
              sx={{ marginLeft: "auto" }}
              disabled={reportTypeVersion.published}
            >
              질문 추가하기
            </StyledButton>
          </StyledDivHeader>
          <BasicDragQuestionsTable
            published={reportTypeVersion.published}
            responseTypeVersionQuestions={reportTypeVersion.questions}
            handleNewOrder={handleNewOrder}
          />
        </StyledContainerOne>
      )}
      {tab == 1 && reportTypeVersion.published && (
        <StyledContainerOne
          style={{
            backgroundColor: "white",
            rowGap: "1.5rem",
            height: "auto",
            justifyContent: "start",
          }}
        >
          <StyledDivHeader>
            <Typography variant="h2">전체 응답</Typography>
            <DownloadCSV csvHeaders={csvHeaders} csvData={csvData} />
          </StyledDivHeader>
          <ReportResponseTable csvHeaders={csvHeaders} csvData={csvData} />
        </StyledContainerOne>
      )}
    </React.Fragment>
  );
};
export default ReportVersion;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const selectedAnimal = context.query.animal;
  const selectedVersion = context.query.version;

  try {
    const reportTypeVersionResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${selectedAnimal}/versions/${selectedVersion}`
    );
    const reportTypeVersion = await reportTypeVersionResponse.data;

    const reportsResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/full?reportType=${selectedAnimal}&reportTypeVersion=${selectedVersion}`
    );
    const reports = await reportsResponse.data;

    return { props: { reportTypeVersion, reports } };
  } catch {
    console.log("There was an error");
  }

  return { props: {} };
};
