import { Question } from "@/pages/reports/types/[animal]";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import React, { useMemo } from "react";
import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export const BasicQuestionsTable = ({
  responseTypeVersionQuestions,
}: {
  responseTypeVersionQuestions?: Question[];
}) => {
  const router = useRouter();
  const { pathname, query } = router;
  const [sortedQuestions, setSortedQuestions] = useState(
    responseTypeVersionQuestions?.sort(
      (a, b) => a.questionOrder - b.questionOrder
    )
  );
  const [localQuestionsOrder, setLocalQuestionsOrder] = useState(
    sortedQuestions?.map((question) => question.id)
  );

  const [active, setActive] = useState<Active | null>(null);
  const activeRow = useMemo(
    () => sortedQuestions?.find((row) => row.id === active?.id),
    [active, sortedQuestions]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!sortedQuestions) {
    return <></>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active?.id !== over?.id) {
          const activeIndex = sortedQuestions.findIndex(
            ({ id }) => id === active?.id
          );
          const overIndex = sortedQuestions.findIndex(
            ({ id }) => id === over?.id
          );

          setSortedQuestions(
            arrayMove(sortedQuestions, activeIndex, overIndex)
          );
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell width={"20%"}>Title</TableCell>
              <TableCell width={"20%"}>Description</TableCell>
              <TableCell width={"20%"}>is Main</TableCell>
              <TableCell width={"20%"}>Required</TableCell>
              <TableCell width={"20%"}>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <SortableContext items={sortedQuestions.map((row) => row.id)}>
              {sortedQuestions.map((row) => (
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
                  <TableCell>{row.type}</TableCell>
                </TableRow>
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </TableContainer>
      <SortableOverlay>
        {activeRow ? <OverlayRow row={activeRow} /> : null}
      </SortableOverlay>
    </DndContext>
  );
};

const OverlayRow = ({ row }: { row: Question }) => {
  return (
    <TableRow key={row.questionOrder} sx={{ cursor: "grab" }}>
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
      <TableCell>{row.type}</TableCell>
    </TableRow>
  );
};

interface Props {
  rows: Question[];
}

export function SortableTable({ rows }: Props) {
  const [active, setActive] = useState<Active | null>(null);
  const activeRow = useMemo(
    () => rows.find((row) => row.id === active?.id),
    [active, rows]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active?.id !== over?.id) {
          const activeIndex = rows.findIndex(({ id }) => id === active?.id);
          const overIndex = rows.findIndex(({ id }) => id === over?.id);

          //   onChange(arrayMove(rows, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={rows.map((row) => row.id)}>
        <table className="SortableTable">
          <tbody>
            {rows.map((row) => (
              <React.Fragment key={row.id}>
                <SortableTableRow id={row.id} />
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </SortableContext>
      <SortableOverlay>{`${activeRow}`}</SortableOverlay>
    </DndContext>
  );
}

function SortableOverlay({ children }: { children: ReactNode }) {
  return <div className="SortableOverlay">{children}</div>;
}

// export const BasicQuestionsTable = ({
//   responseTypeVersionQuestions,
// }: {
//   responseTypeVersionQuestions?: Question[];
// }) => {
//   const columns: GridColDef[] = [
//     { field: "questionOrder", headerName: "ID", width: 90 },
//     {
//       field: "title",
//       headerName: "Title",
//       width: 150,
//     },
//     {
//       field: "description",
//       headerName: "Description",
//       width: 150,
//     },
//     {
//       field: "isMain",
//       headerName: "is Main",
//       width: 150,
//     },
//     {
//       field: "required",
//       headerName: "Required",
//       width: 150,
//     },
//     {
//       field: "type",
//       headerName: "Type",
//       width: 150,
//     },
//   ];
//   const router = useRouter();
//   const { pathname, query } = router;

//   const handleRowClick: GridEventListener<"rowClick"> = (params) => {
//     router.push(
//       `/reports/types/${query.animal}/versions/${query.version}/questions/${params.row.id}`
//     );
//   };

//   return (
//     <DataGrid
//       rows={responseTypeVersionQuestions as Question[]}
//       columns={columns}
//       initialState={{
//         sorting: {
//           sortModel: [{ field: "questionOrder", sort: "asc" }],
//         },
//       }}
//       onRowClick={handleRowClick}
//     />
//   );
// };
