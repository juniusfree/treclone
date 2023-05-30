import Link from "next/link";
import { useState } from "react";
import { useBoardIdContext } from "./boardId";
import { useBoardDispatcherContext } from "./boardsContext";

const BoardIdHeaderComponentWrapper = ({ children }) => {
  return (
    <div className="group/header bg-sky-50 w-full flex gap-4 h-12 fixed items-center px-4 z-50">
      {children}
    </div>
  );
};

const BoardIdHeaderComponent = () => {
  const board = useBoardIdContext();
  const dispatch = useBoardDispatcherContext();
  const { title } = board;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const toggleIsEditing = () => setIsEditing((prev) => !prev);

  const handleOnSave = () => {
    toggleIsEditing();
    dispatch({
      type: "edit board",
      data: {
        boardId: board.id,
        title: newTitle,
      },
    });
  };

  const handleDelete = () => {
    dispatch({
      type: "delete board",
      data: {
        boardId: board.id,
      },
    });
  };

  if (isEditing) {
    return (
      <BoardIdHeaderComponentWrapper>
        <input
          autoFocus
          className="w-48 outline outline-gray-300 px-1 rounded text-sm h-8"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          maxLength={20}
        />
        <button
          onClick={handleOnSave}
          className={`text-sm h-8 flex items-center p-1 rounded bg-sky-700 text-white hover:bg-sky-900 disabled:bg-gray-300`}
          disabled={!title}
        >
          Update
        </button>
      </BoardIdHeaderComponentWrapper>
    );
  }

  return (
    <BoardIdHeaderComponentWrapper>
      <p onClick={toggleIsEditing} className="cursor-pointer font-semibold">
        {title}
      </p>
      <div className="gap-2 hidden group-hover/header:flex items-center text-sky-500 text-sm">
        <button onClick={toggleIsEditing}>Edit</button>
        <Link href="/">
          <button onClick={handleDelete}>Delete</button>
        </Link>
      </div>
    </BoardIdHeaderComponentWrapper>
  );
};

export default BoardIdHeaderComponent;
