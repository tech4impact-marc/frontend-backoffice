import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function StyledPagination() {
  return (
    <Pagination
      count={10}
      renderItem={(item) => (
        <PaginationItem
          slots={{
            previous: ArrowBackIosNewRoundedIcon,
            next: ArrowForwardIosRoundedIcon,
          }}
          {...item}
        />
      )}
      style={{ marginLeft: "auto" }}
    />
  );
}
