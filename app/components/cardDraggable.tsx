import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useBoardIdContext } from "./boardId";
import { useBoardDispatcherContext } from "./boardsContext";

export type CardDraggableProps = {
  title: string;
  id: string;
};

const CardDraggableComponent = ({ title, id }: CardDraggableProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const board = useBoardIdContext();
  const dispatch = useBoardDispatcherContext();
  const [isEditing, setIsEditing] = useState(false);
  const [cardTitle, setCardTitle] = useState(title);
  const toggleIsEditing = () => setIsEditing((prev) => !prev);

  const handleSaveEdit = () => {
    toggleIsEditing();
    dispatch({
      type: "edit card",
      data: {
        cardId: id,
        title: cardTitle,
        boardId: board.id,
      },
    });
  };

  const handleOnDelete = () => {
    dispatch({
      type: "delete card",
      data: {
        cardId: id,
        boardId: board.id,
      },
    });
  };

  if (isEditing) {
    return (
      <div className="relative w-fit-content rounded h-fit bg-gray-100">
        <input
          type="text"
          value={cardTitle}
          className="w-full h-10 rounded shadow border px-2"
          onChange={(e) => setCardTitle(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button onClick={handleSaveEdit}>Save Edit</button>
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
      ref={setNodeRef}
      style={style}
      className={`group/card rounded shadow border px-2 h-10 cursor-pointer flex justify-between items-center bg-gray-50 ${
        isDragging && "opacity-50"
      } `}
      {...listeners}
      {...attributes}
    >
      <p>{title}</p>
      <button
        onClick={handleOnDelete}
        className="w-4 h-4 hidden group-hover/card:block"
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export default CardDraggableComponent;
