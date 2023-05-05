import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useBoardIdContext } from "./boardId";
import { useBoardDispatcherContext } from "./boardsContext";

const AddListComponent = () => {
  const dispatch = useBoardDispatcherContext();
  const currentBoard = useBoardIdContext();
  const [isAddingList, setIsAddlingList] = useState(false);
  const [title, setTitle] = useState("");
  const toggleIsAddingList = () => setIsAddlingList((prev) => !prev);
  const handleAddList = () => {
    dispatch({
      type: "add list",
      data: {
        boardId: currentBoard?.id,
        title,
      },
    });
    toggleIsAddingList();
    setTitle("");
  };
  if (isAddingList) {
    return (
      <div className="w-60 p-4 rounded h-fit bg-gray-100">
        <input
          type="text"
          placeholder="Add a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex items-center">
          <button onClick={handleAddList}>Add List</button>
          <button onClick={toggleIsAddingList} className="h-6 w-6">
            <XMarkIcon />
          </button>
        </div>
      </div>
    );
  }
  return (
    <button
      className="w-60 p-4 rounded h-fit bg-gray-100"
      onClick={toggleIsAddingList}
    >
      Add another list
    </button>
  );
};

export default AddListComponent;
