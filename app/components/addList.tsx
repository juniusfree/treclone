import { PlusIcon } from "@heroicons/react/20/solid";
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
      <div className="w-60 p-4 rounded h-fit bg-gray-100 ">
        <input
          className="w-full outline outline-gray-300 p-1 rounded text-sm"
          type="text"
          placeholder="Add a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="w-full flex items-center justify-between py-2">
          <button
            onClick={handleAddList}
            className={`text-sm p-1 rounded bg-sky-700 text-white hover:bg-sky-900 disabled:bg-gray-300`}
            disabled={!title}
          >
            Create
          </button>
          <button
            onClick={toggleIsAddingList}
            className="text-sm p-1 rounded text-sky-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return (
    <button
      className="w-60 p-4 rounded h-fit bg-gray-100 text-gray-700  hover:bg-sky-500 hover:text-sky-900 flex items-center gap-1"
      onClick={toggleIsAddingList}
    >
      <PlusIcon className="h-4 w-4" />
      Add another list
    </button>
  );
};

export default AddListComponent;
