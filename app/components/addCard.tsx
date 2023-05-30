import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useBoardIdContext } from "./boardId";
import { useBoardDispatcherContext } from "./boardsContext";

const AddCard = ({ listId }: { listId: string }) => {
  const currentBoard = useBoardIdContext();
  const dispatch = useBoardDispatcherContext();
  const [isCreating, setIsCreating] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleIsCreating = () => setIsCreating((prev) => !prev);

  const handleAddCard = () => {
    dispatch({
      type: "add card",
      data: {
        title: inputValue,
        boardId: currentBoard.id,
        listId,
      },
    });
    toggleIsCreating();
    setInputValue("");
  };

  if (isCreating) {
    return (
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter title"
          className="w-full outline outline-gray-300 p-1 rounded text-sm"
        />
        <div className="w-full flex items-center justify-between py-2">
          <button
            onClick={handleAddCard}
            className="text-sm p-1 rounded bg-sky-700 text-white hover:bg-sky-900 disabled:bg-gray-300"
            disabled={!inputValue}
          >
            Add Card
          </button>
          <button
            onClick={toggleIsCreating}
            className="text-sm p-1 rounded text-sky-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={toggleIsCreating}
      className="flex items-center cursor-pointer hover:bg-gray-200 h-fit p-1 rounded gap-2"
    >
      <PlusIcon className="w-4 h-4" /> Add Card
    </div>
  );
};

export default AddCard;
