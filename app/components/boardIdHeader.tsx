import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import { useBoardIdContext } from "./boardId";
import { useBoardDispatcherContext } from "./boardsContext";

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
      <div className="group/header bg-sky-200 w-full flex gap-4 h-12 fixed items-center px-4 z-50">
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
      </div>
    );
  }

  return (
    <div className="group/header bg-sky-200 w-full flex gap-4 h-12 fixed items-center px-4 z-50">
      <p onClick={toggleIsEditing} className="cursor-pointer font-semibold">
        {title}
      </p>
      <div className="flex gap-2">
        <PencilIcon
          className="h-4 w-4 cursor-pointer hidden group-hover/header:block text-sky-900"
          onClick={toggleIsEditing}
        />
        <Link href="/">
          <TrashIcon
            className="h-4 w-4 cursor-pointer hidden group-hover/header:block text-sky-900"
            onClick={handleDelete}
          />
        </Link>
      </div>
    </div>
  );
};

export default BoardIdHeaderComponent;
