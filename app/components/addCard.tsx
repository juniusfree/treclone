import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useBoardContext, useBoardDispatcherContext } from "./BoardDataContext";

const AddCard = ({ listId }: { listId: string }) => {
  const currentBoard = useBoardContext();
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
        />
        <div className="flex items-center gap-2">
          <button onClick={handleAddCard}>Add Card</button>
          <button onClick={toggleIsCreating} className="h-6 w-6">
            <XMarkIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={toggleIsCreating}
      className="flex items-center hover:bg-gray-200 h-fit p-1 rounded gap-2"
    >
      <PlusIcon className="w-4 h-4" /> Add Card
    </div>
  );
};

export default AddCard;
