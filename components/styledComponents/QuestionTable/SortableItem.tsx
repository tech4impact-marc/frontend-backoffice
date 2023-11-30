import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Question } from "@/pages/reports/types/[animal]";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { types } from "@/pages/reports/types/[animal]/versions/[version]/questions/[question]";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";

export const SortableItem = ({
  row,
  published,
}: {
  row: Question;
  published: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  const router = useRouter();
  const { pathname, query } = router;

  const handleDeleteQuestion = (id: number) => {
    if (confirm("질문을 진짜 삭제하시겠습니까?")) {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_IP_ADDRESS}/admin/reports/types/${query.animal}/versions/${query.version}/questions/${id}`
        )
        .then((response) => {
          if (response.status !== 200) {
            alert("오류가 있었습니다.");
          } else {
            alert("질문이 삭제되었습니다.");
            window.location.reload();
          }
        })
        .catch((error) => {
          alert("오류가 있었습니다.");
        });
    }
  };

  const loadQuestion = () => {
    router.push(
      `/reports/types/${query.animal}/versions/${query.version}/questions/${row.id}`
    );
  };

  return (
    <TableRow
      key={row.questionOrder}
      sx={{ cursor: "pointer", ...style }}
      ref={setNodeRef}
    >
      <TableCell align="center">
        <DragHandleIcon
          {...attributes}
          {...listeners}
          style={{ cursor: "grabbing" }}
        />
      </TableCell>
      <TableCell onClick={loadQuestion}>{row.title}</TableCell>
      <TableCell onClick={loadQuestion}>{row.description}</TableCell>
      <TableCell onClick={loadQuestion}>
        {row.isMain.toString().charAt(0).toUpperCase() +
          row.isMain.toString().slice(1)}
      </TableCell>
      <TableCell onClick={loadQuestion}>
        {row.required.toString().charAt(0).toUpperCase() +
          row.required.toString().slice(1)}
      </TableCell>
      <TableCell onClick={loadQuestion}>
        {types[row.type as keyof typeof types]}
      </TableCell>
      <TableCell align="center">
        {!published && (
          <IconButton onClick={() => handleDeleteQuestion(row.id)}>
            <DeleteRoundedIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export const NonSortableItem = ({ row }: { row: Question }) => {
  const router = useRouter();
  const { pathname, query } = router;

  return (
    <TableRow
      key={row.questionOrder}
      sx={{ cursor: "pointer" }}
      onClick={() => {
        router.push(
          `/reports/types/${query.animal}/versions/${query.version}/questions/${row.id}`
        );
      }}
    >
      <TableCell align="center"></TableCell>
      <TableCell>{row.title}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>
        {row.isMain.toString().charAt(0).toUpperCase() +
          row.isMain.toString().slice(1)}
      </TableCell>
      <TableCell>
        {row.required.toString().charAt(0).toUpperCase() +
          row.required.toString().slice(1)}
      </TableCell>
      <TableCell>{types[row.type as keyof typeof types]}</TableCell>
      <TableCell align="center">{/* <DeleteRoundedIcon /> */}</TableCell>
    </TableRow>
  );
};
