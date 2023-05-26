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
      <div className="bg-gray-500 w-full">
        <input
          className="bg-gray-500"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button className="bg-gray-500" onClick={handleOnSave}>
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="group/header bg-gray-500 w-full flex">
      <p onClick={toggleIsEditing} className="cursor-pointer">
        {title}
      </p>
      <PencilIcon
        className="h-5 w-5 cursor-pointer hidden group-hover/header:block"
        onClick={toggleIsEditing}
      />
      <Link href="/">
        <TrashIcon
          className="h-5 w-5 cursor-pointer hidden group-hover/header:block"
          onClick={handleDelete}
        />
      </Link>
    </div>
  );
};

export default BoardIdHeaderComponent;
