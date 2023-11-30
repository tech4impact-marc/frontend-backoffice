import React, { useId, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { NonSortableItem, SortableItem } from "./SortableItem";
import { useRouter } from "next/router";
import { Question } from "@/pages/reports/types/[animal]";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export const BasicDragQuestionsTable = ({
  published,
  responseTypeVersionQuestions,
  handleNewOrder,
}: {
  published: boolean;
  responseTypeVersionQuestions?: Question[];
  handleNewOrder: any;
}) => {
  const [sortedQuestions, setSortedQuestions] = useState(
    responseTypeVersionQuestions?.sort(
      (a, b) => a.questionOrder - b.questionOrder
    )
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const id = useId();

  if (!sortedQuestions) {
    return <></>;
  }

  const localQuestionsOrder = sortedQuestions.map((question) => question.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={id}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell width={"20%"}>Title</TableCell>
            <TableCell width={"20%"}>Description</TableCell>
            <TableCell width={"20%"}>is Main</TableCell>
            <TableCell width={"15%"}>Required</TableCell>
            <TableCell width={"15%"}>Type</TableCell>
            <TableCell width={"15%"} align="center">
              Delete
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {published ? (
            <React.Fragment>
              {sortedQuestions.map((question) => (
                <NonSortableItem key={question.id} row={question} />
              ))}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {sortedQuestions.slice(0, 3).map((question) => (
                <NonSortableItem key={question.id} row={question} />
              ))}
              <SortableContext
                items={localQuestionsOrder}
                strategy={verticalListSortingStrategy}
              >
                {sortedQuestions.slice(3).map((question) => (
                  <SortableItem
                    key={question.id}
                    row={question}
                    published={published}
                  />
                ))}
              </SortableContext>
            </React.Fragment>
          )}
        </TableBody>
      </Table>
    </DndContext>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!sortedQuestions) {
      return;
    }

    if (active.id !== over.id) {
      let newQuestions: Question[] = [];
      setSortedQuestions((questions: Question[]) => {
        newQuestions = [...questions];
        const oldIndex = questions.findIndex(
          (question) => question.id === active.id
        );
        const newIndex = questions.findIndex(
          (question) => question.id === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const movedQuestion = newQuestions.splice(oldIndex, 1)[0];
          newQuestions.splice(newIndex, 0, movedQuestion);
        }

        return newQuestions;
      });

      if (newQuestions) {
        handleNewOrder({
          data: {
            type: "ORDER",
            orders: newQuestions.map((question) => question.id),
          },
        });
      }
    }
  }
};
