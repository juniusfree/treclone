"use client";

import { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { ListDroppableProps } from "./listDroppable";

const initialData = [
  {
    id: uuidv4(),
    title: "board 1",
    lists: [
      {
        id: uuidv4(),
        title: "List 1",
        cards: Array.from({ length: 20 }).map((_, j) => ({
          id: uuidv4(),
          title: `Card ${j}`,
        })),
      },
      {
        id: uuidv4(),
        title: "List 2",
        cards: Array.from({ length: 5 }).map((_, j) => ({
          id: uuidv4(),
          title: `Card ${j}`,
        })),
      },
    ],
  },
  {
    id: uuidv4(),
    title: "board 2",
    lists: Array.from({ length: 3 }).map((_, i) => ({
      id: uuidv4(),
      title: `List ${i}`,
      cards: Array.from({ length: 20 }).map((_, j) => ({
        id: uuidv4(),
        title: `Card ${i}-${j}`,
      })),
    })),
  },
];

const BoardsContext = createContext(initialData);

export const useBoardsContext = () => {
  const context = useContext(BoardsContext);
  if (context === null) {
    throw new Error(
      "useBoardContext must be used within a BoardContext.Provider"
    );
  }
  return context;
};

const BoardDispatcherContext = createContext<Dispatch<any>>(() => {});

export const useBoardDispatcherContext = () =>
  useContext(BoardDispatcherContext);

const findBoard = (boards: typeof initialData, boardId: string) => {
  const boardIndex = boards.findIndex((board) => board.id === boardId);
  const currentBoard = boards?.[boardIndex];
  return currentBoard;
};

export const findList = (lists: ListDroppableProps[], id?: UniqueIdentifier) =>
  lists?.find((list) => list?.cards?.find((card) => card.id === id)) ||
  lists?.find((list) => list.id === id);

const boardReducer = (
  boardsRaw: typeof initialData,
  action: {
    type: string;
    data: any;
  }
) => {
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
    const overListCards = overList?.cards || [];
    const activeDraggableListUpdatedCards =
      activeDraggableList?.cards.filter((i) => i.id !== activeDraggableId) ||
      [];
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

  if (action.type === "edit card") {
    console.log("edit card");
    const { data } = action;
    const { title, boardId, cardId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = [...currentBoard?.lists];
    const listToBeUpdated = findList(lists, cardId) as ListDroppableProps;
    const listToBeUpdatedIndex = lists?.findIndex(
      (list) => list === listToBeUpdated
    );
    const listToBeUpdatedCards = listToBeUpdated?.cards || [];
    const cardToBeUpdated = listToBeUpdatedCards?.find(
      ({ id }) => id === cardId
    );
    const cardToBeUpdatedIndex = listToBeUpdatedCards?.findIndex(
      ({ id }) => id === cardId
    );
    listToBeUpdatedCards[cardToBeUpdatedIndex] = {
      ...cardToBeUpdated,
      id: cardId,
      title,
    };

    lists[listToBeUpdatedIndex] = {
      ...listToBeUpdated,
      cards: listToBeUpdatedCards,
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
    const activeDraggableListCards = activeDraggableList?.cards || [];

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

  if (action.type === "delete card") {
    const { data } = action;
    const { boardId, cardId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = [...currentBoard?.lists];
    const listToBeUpdated = findList(lists, cardId) as ListDroppableProps;
    const listToBeUpdatedIndex = lists?.findIndex(
      (list) => list === listToBeUpdated
    );
    const listToBeUpdatedCards = listToBeUpdated?.cards || [];
    const cardToBeUpdatedIndex = listToBeUpdatedCards?.findIndex(
      ({ id }) => id === cardId
    );
    listToBeUpdatedCards.splice(cardToBeUpdatedIndex, 1);

    lists[listToBeUpdatedIndex] = {
      ...listToBeUpdated,
      cards: listToBeUpdatedCards,
    };

    boards[currentBoardIndex] = {
      ...currentBoard,
      lists,
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

  if (action.type === "add list") {
    const { data } = action;
    const { title, boardId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = [...currentBoard?.lists];
    boards[currentBoardIndex] = {
      ...currentBoard,
      lists: lists.concat({ id: uuidv4(), title, cards: [] }),
    };
    return boards;
  }

  if (action.type === "edit list") {
    console.log("edit list");
    const { data } = action;
    const { title, boardId, listId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = [...currentBoard?.lists];
    const listToBeUpdatedIndex = lists.findIndex((list) => list.id === listId);
    lists[listToBeUpdatedIndex] = {
      ...lists[listToBeUpdatedIndex],
      title,
    };
    boards[currentBoardIndex] = {
      ...currentBoard,
      lists,
    };
    return boards;
  }

  if (action.type === "delete list") {
    const { data } = action;
    const { boardId, listId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    const lists = [...currentBoard?.lists];
    const listToBeDeletedIndex = lists.findIndex((list) => list.id === listId);
    lists.splice(listToBeDeletedIndex, 1);
    boards[currentBoardIndex] = {
      ...currentBoard,
      lists,
    };
    return boards;
  }

  if (action.type === "add board") {
    console.log("add board");
    const { data } = action;
    const { title } = data;
    return boards.concat({
      title,
      id: uuidv4(),
      lists: [],
    });
  }

  if (action.type === "edit board") {
    console.log("edit board");
    const { data } = action;
    const { title, boardId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    boards[currentBoardIndex] = {
      ...currentBoard,
      title,
    };
    return boards;
  }

  if (action.type === "delete board") {
    console.log("delete board");
    const { data } = action;
    const { boardId } = data;
    const currentBoard = findBoard(boards, boardId);
    const currentBoardIndex = boards.findIndex(
      (board) => board === currentBoard
    );
    boards.splice(currentBoardIndex, 1);
    return boards;
  }

  if (action.type === "load localstorage") {
    console.log("load localstorage");
    const { data } = action;
    return data;
  }

  return boards;
};

const BoardsContextComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [boards, dispatch] = useReducer(boardReducer, initialData);

  useEffect(() => {
    const data = localStorage.getItem("boards");
    if (data) {
      dispatch({
        type: "load localstorage",
        data: JSON.parse(data),
      });
    }
  }, []);

  useEffect(() => {
    console.log("save localstorage");
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  return (
    <BoardsContext.Provider value={boards}>
      <BoardDispatcherContext.Provider value={dispatch}>
        {children}
      </BoardDispatcherContext.Provider>
    </BoardsContext.Provider>
  );
};

export default BoardsContextComponent;
