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
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  useGridApiContext,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
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

  const handleSaveClick = (id: GridRowId) => () => {
    const rowUpdates = apiRef.current.getRowWithUpdatedValues(
      id,
      "modifiedByAdmin"
    );
    const answers = Object.keys(rowUpdates)
      .map((questionId, index) => ({
        value: rowUpdates[questionId],
        type: parsedHeaders[index + 1]?.type,
        questionId: questionId,
      }))
      .filter((item, index) => item.type);
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        reportTypeId: parseInt(router.query.animal as string),
        reportTypeVersionId: parseInt(router.query.version as string),
        answers: answers,
      })
    );

    axios
      .patch(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/${id}/answers`,
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          transformRequest: (formData) => formData,
        }
      )
      .then(function (response) {
        if (response.status == 200) {
          setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
          });
        } else {
          console.log(response);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    if (!parsedData.find((row) => row.id !== id)) {
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

  const parsedHeaders: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<ClearRoundedIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={<EditRoundedIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteRoundedIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        }
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
        editable: true,
      }))
  );

  const [parsedData, setParsedData] = useState(
    csvData.map((data) => ({
      ...data,
    }))
  );

  // return <></>;
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        editMode="row"
        columns={parsedHeaders}
        rows={parsedData}
        sx={{ overflow: "scroll", minWidth: "100%" }}
        rowModesModel={rowModesModel}
        apiRef={apiRef}
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
