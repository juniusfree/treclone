"use client";

import { useBoardsContext } from "@/app/components/boardsContext";
import DndContextComponent from "@/app/components/dndContext";
import { createContext, useContext } from "react";

type BoardIdComponentProps = {
  params: {
    id: string;
  };
};

const BoardIdContext = createContext({ id: "", lists: [] });

export const useBoardIdContext = () => {
  const context = useContext(BoardIdContext);
  if (context === null) {
    throw new Error(
      "useBoardIdContext must be used within a BoardIdContext.Provider"
    );
  }
  return context;
};

const BoardIdComponent = ({ params }: BoardIdComponentProps) => {
  const boards = useBoardsContext();
  const currentBoard = boards.find((board) => board.id === params.id);
  if (!currentBoard) return null;
  return (
    <BoardIdContext.Provider value={currentBoard}>
      <DndContextComponent />
    </BoardIdContext.Provider>
  );
};

export default BoardIdComponent;
