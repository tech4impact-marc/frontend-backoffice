import SearchIcon from "@mui/icons-material/Search";
import StickyHeadTableUser1 from "@/components/styledComponents/StyledTableUser1";
import { Pagination, IconButton, TextField, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

const columns: string[] = ["유저 ID", "닉네임", "이메일", "전화번호", "Signup"];

export default function AllUsers() {
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const fetchData = async (pageArg: number = 0, searchArg: string = "") => {
    const params: { [key: string]: number | string } = {};

    if (pageArg) {
      params.page = pageArg;
    }

    if (searchArg) {
      params.all = searchArg;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/users`,
        {
          params: params,
        }
      );

      const newRows = response.data.contents.map((user: any) => ({
        "유저 ID": user.id,
        닉네임: user.nickname,
        이메일: user.email,
        전화번호: user.phoneNumber,
        Signup: user.createdDateTime,
      }));

      console.log(newRows);
      setRows(newRows);
      setTotalNumberOfPages(response.data.totalNumberOfPages);
    } catch (error) {
      console.log("에러 발생: ", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchData(currentPage, searchValue);
    console.log("검색 버튼이 클릭되었습니다. 검색어:", searchValue);
  };

  const handlePageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    newPage: number
  ) => {
    setCurrentPage(newPage - 1);
    console.log(currentPage);
  };

  useEffect(() => {
    fetchData(currentPage, searchValue);
  }, [currentPage]);

  return (
    <React.Fragment>
      <Container
        sx={{
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          flex: "1 0 0",
          padding: "16px 32px 32px 32px",
          gap: "16px",
        }}
      >
        <Container sx={{ flexDirection: "row" }}>
          <TextField
            variant="standard"
            value={searchValue}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <IconButton size="large" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{
              width: "358px",
              alignSelf: "stretch",
            }}
          ></TextField>
          <Pagination
            count={totalNumberOfPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            sx={{
              marginLeft: "auto",
            }}
          />
        </Container>
        <StickyHeadTableUser1 columns={columns} rows={rows} />
      </Container>
    </React.Fragment>
  );
}
