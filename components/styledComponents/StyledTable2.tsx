import {
  Question,
  ReportTypeVersionsResponseDto,
} from "@/pages/reports/types/[animal]";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

export const BasicTable = ({
  reportTypeVersion,
}: {
  reportTypeVersion: ReportTypeVersionsResponseDto;
}) => {
  const [rows, setRows] = useState(reportTypeVersion.contents);
  const router = useRouter();
  const { pathname, query } = router;
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={"20%"}>리포트 버전</TableCell>
            <TableCell width={"20%"}>생성일</TableCell>
            <TableCell width={"20%"}>최종 수정일</TableCell>
            <TableCell width={"20%"}>배포 날짜</TableCell>
            <TableCell width={"20%"}>배포 상태</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.versionNumber}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                router.push(
                  `/reports/types/${query.animal}/versions/${row.id}`
                );
              }}
            >
              <TableCell component="th" scope="row">
                {row.versionNumber}
              </TableCell>
              <TableCell>
                {row.createdDateTime.toString().slice(0, 19).replace("T", " ")}
              </TableCell>
              <TableCell>
                {row.modifiedDateTime.toString().slice(0, 19).replace("T", " ")}
              </TableCell>
              <TableCell>
                {row.publishedDateTime
                  ?.toString()
                  .slice(0, 19)
                  .replace("T", " ")}
              </TableCell>
              <TableCell align="center">
                <div
                  style={{
                    borderRadius: " 6.25rem",
                    background: row.published ? "#223047" : "#9AA8BF",
                    display: "flex",
                    width: "5rem",
                    padding: "0.375rem",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {row.published ? "배포" : "미배포"}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
