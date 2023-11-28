import axios from "axios";
import { GetServerSideProps } from "next";
import {
  ReportTypeSimpleResponseDto,
  ReportTypeVersionSimpleResponseDto,
} from "../..";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  StyledContainerOne,
  StyledContainerThree,
  StyledDivHeader,
} from "@/components/styledComponents/StyledContainer";
import { Tab, Tabs, TextField, Typography, styled } from "@mui/material";
import { StyledButton } from "@/components/layout/BackOfficeLayout";
import theme from "@/styles/theme";
import { BasicDragQuestionsTable } from "@/components/styledComponents/dragTable/Table";
import { error } from "console";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
}: {
  reportTypeVersion: ReportTypeVersionSimpleResponseDto;
}) => {
  console.log(reportTypeVersion);
  const router = useRouter();
  const { pathname, query } = router;

  const [tab, setTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handlePublish = async () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${query.animal}/versions/${query.version}/publish`
      )
      .then((response) => {
        if (response.status !== 200) {
          alert("오류가 있었습니다.");
        } else {
          alert("성공적으로 배포되었습니다.");
          window.location.reload();
        }
      })
      .catch((error) => {
        alert("오류가 있었습니다.");
      });
  };

  const handleCopy = async () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${query.animal}/versions/${query.version}/duplicate`
      )
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          alert("오류가 있었습니다.");
        } else {
          alert("성공적으로 복제되었습니다.");
          window.location.reload();
        }
      })
      .catch((error) => {
        alert("오류가 있었습니다.");
      });
  };

  const handleNewOrder = ({
    data,
  }: {
    data: { type: string; orders: number[] };
  }) => {
    console.log("data:", data);
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
    const initQuestion = {
      type: "MULTIPLE_CHOICE(SINGLE)",
      required: false,
      isMain: false,
      questionOrder:
        Math.max(
          ...reportTypeVersion.questions.map(
            (question) => question.questionOrder
          )
        ) + 1,
      title: "질문 제목",
      description: "질문 설명",
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
            onClick={reportTypeVersion.published ? handleCopy : handlePublish}
            sx={{ marginLeft: "auto" }}
          >
            {reportTypeVersion.published ? "복제하기" : "배포하기"}
          </StyledButton>
        </StyledDivHeader>

        <div style={{ display: "flex", width: "100%", columnGap: "1rem" }}>
          <StyledContainerThree style={{ flex: "1" }}>
            <Typography variant="body1">버전</Typography>
            <TextField
              variant="standard"
              name={"title"}
              value={`V${reportTypeVersion.versionNumber}`}
              disabled
            />
          </StyledContainerThree>
          <StyledContainerThree style={{ flex: "5" }}>
            <Typography variant="body1">메모</Typography>
            <TextField
              variant="standard"
              name={"subtitle"}
              value={"MEMO가 없다..?"}
              disabled
            />
          </StyledContainerThree>
        </div>
      </StyledContainerOne>

      <StyledContainerOne style={{ padding: "0" }}>
        <StyledTabs value={tab} onChange={handleTabChange}>
          <StyledTab label="질문" />
          <StyledTab label="응답" />
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

    return { props: { reportTypeVersion } };
  } catch {
    console.log("There was an error");
  }

  return { props: {} };
};
