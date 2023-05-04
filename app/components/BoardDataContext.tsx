"use client";

import {
  Dispatch,
  createContext,
  useContext,
  useReducer,
  useState,
} from "react";
import DndContextComponent from "./dndContext";
import { v4 as uuidv4 } from "uuid";
import { ListDroppableProps } from "./listDroppable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const BoardContext = createContext({ currentBoard: null });

export const useBoardContext = () => useContext(BoardContext);

const BoardDispatcherContext = createContext<Dispatch<any>>(null);

export const useBoardDispatcherContext = () =>
  useContext(BoardDispatcherContext);

const initialData = [
  {
    id: "1",
    lists: [
      {
        id: "list-1",
        title: "List 1",
        cards: [
          {
            id: "card-1",
            title: "Card 1",
          },
        ],
      },
      {
        id: "list-2",
        title: "List 2",
        cards: [
          {
            id: "card-2",
            title: "Card 2",
          },
          {
            id: "card-4",
            title: "Card 4",
          },
          {
            id: "card-5",
            title: "Card 5",
          },
        ],
      },
      {
        id: "list-3",
        title: "List 3",
        cards: [
          {
            id: "card-3",
            title: "Card 3",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    lists: [],
  },
];

const findBoard = (boards, boardId) => {
  const boardIndex = boards.findIndex((board) => board.id === boardId);
  const currentBoard = boards?.[boardIndex];
  return currentBoard;
};

export const findList = (lists?: ListDroppableProps[], id?: UniqueIdentifier) =>
  lists?.find((list) => list?.cards?.find((card) => card.id === id)) ||
  lists?.find((list) => list.id === id);

const boardReducer = (boardsRaw, action) => {
  const boards = [...boardsRaw];
  if (action.type === "add card") {
    console.log("add card");
    const { data } = action;
    const currentBoard = findBoard(boards, data.boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = [...currentBoard.lists];
    const listToBeUpdatedIndex = lists.findIndex(
      (list) => list.id === data.listId
    );
    const listToBeUpdated = lists[listToBeUpdatedIndex];
    lists[listToBeUpdatedIndex] = {
      ...listToBeUpdated,
      cards: listToBeUpdated.cards.concat({
        id: uuidv4(),
        title: data.title,
      }),
    };

    boards[currentBoardIndex] = {
      ...currentBoard,
      lists: lists,
    };
    return boards;
  }

  if (action.type === "sort lists") {
    console.log("sort lists");
    const { data } = action;
    const { activeDraggableId, boardId, overId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = currentBoard?.lists;
    const activeDraggableList = findList(lists, activeDraggableId);
    const activeDraggableListIndex = lists?.findIndex(
      (list) => list === activeDraggableList
    );
    const overList = findList(lists, overId);
    const overListIndex = lists.findIndex((list) => list === overList);

    const updatedLists = arrayMove(
      lists,
      activeDraggableListIndex,
      overListIndex
    );
    boards[currentBoardIndex] = {
      ...currentBoard,
      lists: updatedLists,
    };
    return boards;
  }

  if (action.type === "move card") {
    console.log("move card");
    const { data } = action;
    const { activeCardData, activeDraggableId, boardId, overId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = [...currentBoard?.lists];
    const activeDraggableList = findList(lists, activeDraggableId);
    const activeDraggableListIndex = lists?.findIndex(
      (list) => list === activeDraggableList
    );
    const overList = findList(lists, overId);
    const overListIndex = lists.findIndex((list) => list === overList);
    const overListCards = overList?.cards;
    const activeDraggableListUpdatedCards = activeDraggableList?.cards.filter(
      (i) => i.id !== activeDraggableId
    );
    const overListUpdatedCards = [activeCardData, ...overListCards];
    lists[activeDraggableListIndex] = {
      ...lists[activeDraggableListIndex],
      cards: activeDraggableListUpdatedCards,
    };
    lists[overListIndex] = {
      ...lists[overListIndex],
      cards: overListUpdatedCards,
    };
    boards[currentBoardIndex] = {
      ...currentBoard,
      lists,
    };
    return boards;
  }

  if (action.type === "sort cards") {
    console.log("sort cards");
    const { data } = action;
    const { activeDraggableId, boardId, overId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = [...currentBoard?.lists];
    const overList = findList(lists, overId);
    const overListId = overList?.id;
    const activeDraggableList = findList(lists, activeDraggableId);
    const activeDraggableListId = activeDraggableList?.id;
    const activeDraggableListCards = activeDraggableList?.cards;

    if (activeDraggableListId === overListId) {
      // Handles sorting on the same list
      const activeDraggableListIndex = lists.findIndex(
        (i) => i.id === activeDraggableListId
      );
      const oldIndex = activeDraggableListCards?.findIndex(
        (i) => i.id === activeDraggableId
      );
      const overIdCard = activeDraggableListCards?.find((i) => i.id === overId);

      const newIndex = overIdCard
        ? activeDraggableListCards?.findIndex((i) => i.id === overId)
        : 0;

      lists[activeDraggableListIndex] = {
        ...lists[activeDraggableListIndex],
        cards: arrayMove(activeDraggableListCards, oldIndex, newIndex),
      };

      boards[currentBoardIndex] = {
        ...currentBoard,
        lists,
      };
      return boards;
    }
    return boards;
  }
  return boards;
};

const BoardContextComponent = ({ boardId }: { boardId: string }) => {
  const [board, dispatch] = useReducer(boardReducer, initialData);
  const boardIndex = board.findIndex((board) => board.id === boardId);
  const currentBoard = board?.[boardIndex];
  return (
    <BoardContext.Provider value={currentBoard}>
      <BoardDispatcherContext.Provider value={dispatch}>
        <div className="flex gap-4">
          <DndContextComponent />
        </div>
      </BoardDispatcherContext.Provider>
    </BoardContext.Provider>
  );
};

export default BoardContextComponent;
