import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

function createData(
  versionNumber: number,
  createdDateTime: string,
  modifiedDateTime: string,
  published: boolean
) {
  return { versionNumber, createdDateTime, modifiedDateTime, published };
}

const data = [createData(1, "hi", "hi", false)];

export default function BasicTable() {
  const [rows, setRows] = React.useState(data);
  const router = useRouter();
  const { pathname } = router;
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={"20%"}>리포트 버전</TableCell>
            <TableCell width={"20%"}>생성일</TableCell>
            <TableCell width={"20%"}>최종 수정일</TableCell>
            <TableCell width={"20%"}>배포 상태</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.versionNumber}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                router.push(`${pathname}/${row.versionNumber}`);
              }}
            >
              <TableCell component="th" scope="row">
                {row.versionNumber}
              </TableCell>
              <TableCell>{row.createdDateTime}</TableCell>
              <TableCell>{row.modifiedDateTime}</TableCell>
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
}
