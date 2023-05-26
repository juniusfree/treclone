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
    <div className="bg-gray-500 w-full">
      <p onClick={toggleIsEditing} className="cursor-pointer">
        {title}
      </p>
    </div>
  );
};

export default BoardIdHeaderComponent;
