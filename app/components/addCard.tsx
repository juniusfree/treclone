import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useBoardContext, useBoardDispatcherContext } from "./BoardDataContext";

const AddCard = ({ listId }: { listId: string }) => {
  const currentBoard = useBoardContext();
  const dispatch = useBoardDispatcherContext();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleIsEditing = () => setIsEditing((prev) => !prev);

  const handleAddCard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "add card",
      data: {
        title: inputValue,
        boardId: currentBoard.id,
        listId,
      },
    });
    toggleIsEditing();
    setInputValue("");
  };

  if (isEditing) {
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
          <button onClick={toggleIsEditing} className="h-6 w-6">
            <XMarkIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={toggleIsEditing}
      className="flex items-center hover:bg-gray-200 h-fit p-1 rounded gap-2"
    >
      <PlusIcon className="w-4 h-4" /> Add Card
    </div>
  );
};

export default AddCard;
