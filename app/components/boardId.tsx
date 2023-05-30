"use client";

import { useBoardsContext } from "@/app/components/boardsContext";
import DndContextComponent from "@/app/components/dndContext";
import { createContext, useContext } from "react";
import { BoardIdComponentProps } from "@/app/board/[id]/page";
import BoardIdHeaderComponent from "./boardIdHeader";

type BoardIdContextType = {
  id: any;
  title: string;
  lists: {
    id: any;
    title: string;
    cards: {
      id: any;
      title: string;
    }[];
  }[];
} | null;

const BoardIdContext = createContext<BoardIdContextType>(null);

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
      <div className="relative h-screen">
        <BoardIdHeaderComponent />
        <DndContextComponent />
      </div>
    </BoardIdContext.Provider>
  );
};

export default BoardIdComponent;
