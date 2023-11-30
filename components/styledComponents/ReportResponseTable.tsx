import {
  Question,
  ReportTypeVersionSimpleResponseDto,
} from "@/pages/reports/types/[animal]";
import { StyledButton } from "../layout/BackOfficeLayout";
import { useRouter } from "next/router";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Data } from "react-csv/lib/core";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  useGridApiContext,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";

export const ReportResponseTable = ({
  csvHeaders,
  csvData,
}: {
  csvHeaders: any[];
  csvData: any[];
}) => {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const apiRef = useGridApiRef();
  const router = useRouter();

  const handleDeleteClick = (id: GridRowId) => () => {
    if (!parsedData.find((row) => row.id === id)) {
      return;
    }
    if (confirm("리포트를 진짜 삭제하시겠습니까?")) {
      axios
        .delete(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setParsedData(parsedData.filter((row) => row.id !== id));
            console.log(response.data);
          } else {
            console.log("에러가 있었습니다");
          }
        })
        .catch((error) => {
          console.log("에러가 있었습니다");
        });
    }
  };

  const handleTogglePublic = (id: GridRowId) => () => {
    const row = parsedData.find((row) => row.id === id);
    if (!row) {
      return;
    }
    if (
      confirm(
        `리포트를 ${row.isPublic ? "비공개로" : "공개로"} 바꾸시겠습니까?`
      )
    ) {
      axios
        .patch(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/${id}`, {
          isPublic: !row.isPublic,
        })
        .then((response) => {
          if (response.status === 200) {
            setParsedData(
              parsedData.map((row) =>
                row.id === id ? { ...row, isPublic: !row.isPublic } : row
              )
            );
            console.log(response.data);
          } else {
            console.log("에러가 있었습니다");
          }
        })
        .catch((error) => {
          console.error("에러가 있었습니다");
        });
    }
  };

  const parsedHeaders: GridColDef[] = [
    {
      field: "delete",
      type: "actions",
      headerName: "삭제",
      width: 70,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={2}
            icon={<DeleteRoundedIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: "open",
      type: "actions",
      headerName: "공개",
      width: 70,
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            key={2}
            icon={
              row.isPublic ? (
                <CheckCircleOutlineRoundedIcon />
              ) : (
                <CancelRoundedIcon />
              )
            }
            label="Open"
            onClick={handleTogglePublic(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  parsedHeaders.push(
    ...csvHeaders
      .filter(
        (header) =>
          header.key !== "createdDateTime" && header.key !== "modifiedByAdmin"
      )
      .map((header) => ({
        field: header.key,
        headerName: header.label,
        type: header.type,
        minWidth: 200,
      }))
  );

  const [parsedData, setParsedData] = useState(
    csvData.map((data) => ({
      ...data,
    }))
  );

  const handleRowClick: GridEventListener<"rowClick"> = (
    params: GridRowParams
  ) => {
    router.push(`/posts/${params.row.id}`);
  };

  // return <></>;
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        columns={parsedHeaders}
        rows={parsedData}
        sx={{
          overflow: "scroll",
          minWidth: "100%",
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        rowModesModel={rowModesModel}
        apiRef={apiRef}
        getRowId={(row) => row.id}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

const CSVLink = dynamic(
  import("react-csv").then((res) => {
    const { CSVLink } = res;
    return CSVLink;
  }),
  {
    ssr: false,
    loading: () => <React.Fragment></React.Fragment>,
  }
);

export const DownloadCSV = ({
  csvHeaders,
  csvData,
}: {
  csvHeaders: any[];
  csvData: Data;
}) => {
  const router = useRouter();

  return (
    <CSVLink
      data={csvData}
      headers={csvHeaders}
      style={{ marginLeft: "auto" }}
      filename={`report-${router.query.animal}-version-${router.query.version}.csv`}
    >
      <StyledButton
        variant="text"
        color="secondary"
        sx={{ marginLeft: "auto" }}
      >
        CSV 다운로드
      </StyledButton>
    </CSVLink>
  );
};

export const responseToCsvData = (questions: Question[], reports: any[]) => {
  const headers = [
    { label: "생성 일시", key: "createdDateTime" },
    { label: "관리자 수정 여부", key: "modifiedByAdmin" },
    ...questionsToHeaders(questions),
  ];
  const data = reports.map((report) => processReportResponse(report));
  return { data, headers };
};

const questionsToHeaders = (questions: Question[]) => {
  // function for csvHeaders
  const headers: any[] = [];
  // const questionIdKeyMap = {};
  questions.map((question) => {
    // console.log(JSON.stringify(question));
    headers.push({
      label: question.title,
      key: question.id.toString(),
      type: question.type,
    });
  });
  return headers;
};

const processReportResponse = (report: any) => {
  // function for csvData (report)
  const processAnswer = (answer: any): string => {
    if (isReportQuestionTextType(answer.question.type)) {
      // process text type answer
      return answer.value != null ? answer.value : "";
    }
    if (isReportQuestionDateTimeType(answer.question.type)) {
      // process datetime type answer
      return answer.value != null ? answer.value.toString() : "";
    }
    if (isReportQuestionFileType(answer.question.type)) {
      // process file type answer
      return answer.value?.fileUrl != null ? answer.value.fileUrl : "";
    }
    if (isReportQuestionLocationType(answer.question.type)) {
      // process location type answer
      let result = "";
      if (answer.value?.longitude != null || answer.value?.longitude != null) {
        result += `(x;y) : (${answer.value?.longitude}; ${answer.value?.latitude})`;
      }
      if (answer.value?.address != null || answer.value?.addressDetail) {
        result += ` (address) : (${
          answer.value?.address != null ? answer.value.address : ""
        }  ${
          answer.value?.addressDetail != null ? answer.value.addressDetail : ""
        }) `;
      }
      return result;
    }
    return answer.value != null ? answer.value.toString() : "";
  };

  const processAnswers = (answers: any[]) => {
    const data: { [key: string]: any } = {};
    for (const answer of answers) {
      data[answer.question.id] =
        data[answer.question.id] == null
          ? processAnswer(answer)
          : data[answer.question.id] + " | " + processAnswer(answer); // use answer non-comma separator |
    }
    return data;
  };
  return {
    createdDateTime: report.createdDateTime,
    modifiedByAdmin: report.modifiedByAdmin,
    id: report.id,
    isPublic: report.isPublic,
    ...processAnswers(report.answers),
  };
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// ---------------------------------------- question type checking functions ---------------------------------------- /////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const questionTextTypes = [
  "SHORT_ANSWER",
  "LONG_ANSWER",
  "MULTIPLE_CHOICE(SINGLE)",
  "MULTIPLE_CHOICE(MULTI)",
] as const;
const questionDateTimeTypes = ["DATETIME"] as const;
const questionLocationTypes = ["LOCATION"] as const;
const questionFileTypes = ["FILE", "IMAGE"] as const;
export const isReportQuestionTextType = (arg: any) => {
  return questionTextTypes.some((element) => element === arg);
};
export const isReportQuestionDateTimeType = (arg: any) => {
  return questionDateTimeTypes.some((element) => element === arg);
};
export const isReportQuestionLocationType = (arg: any) => {
  return questionLocationTypes.some((element) => element === arg);
};
export const isReportQuestionFileType = (arg: any) => {
  return questionFileTypes.some((element) => element === arg);
};
