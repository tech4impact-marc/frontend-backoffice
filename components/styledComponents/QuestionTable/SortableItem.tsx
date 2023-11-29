import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Question } from "@/pages/reports/types/[animal]";
import { TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { types } from "@/pages/reports/types/[animal]/versions/[version]/questions/[question]";

export const SortableItem = ({ row }: { row: Question }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  const router = useRouter();
  const { pathname, query } = router;

  return (
    <TableRow
      key={row.questionOrder}
      sx={{ cursor: "pointer", ...style }}
      onClick={() => {
        router.push(
          `/reports/types/${query.animal}/versions/${query.version}/questions/${row.id}`
        );
      }}
      ref={setNodeRef}
    >
      <TableCell align="center">
        <DragHandleIcon
          {...attributes}
          {...listeners}
          style={{ cursor: "grabbing" }}
        />
      </TableCell>
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
    </TableRow>
  );
};
