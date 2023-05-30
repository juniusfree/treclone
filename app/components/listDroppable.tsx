import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import AddCard from "./addCard";
import { useBoardIdContext } from "./boardId";
import { useBoardDispatcherContext } from "./boardsContext";
import CardDraggableComponent, { CardDraggableProps } from "./cardDraggable";

export type ListDroppableProps = {
  id: string;
  title: string;
  cards: CardDraggableProps[];
  activeCardId?: string;
  isDragOverlay?: boolean;
};

const ListDroppableComponent = ({
  title,
  cards = [],
  id,
  isDragOverlay = false,
}: ListDroppableProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setNodeRefSortable,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const currentBoard = useBoardIdContext();
  const dispatcher = useBoardDispatcherContext();
  const [listTitle, setListTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const toggleIsEditing = () => setIsEditing((prev) => !prev);
  const handleOnSave = () => {
    dispatcher({
      type: "edit list",
      data: {
        boardId: currentBoard.id,
        listId: id,
        title: listTitle,
      },
    });
    toggleIsEditing();
  };
  const handleOnDelete = () => {
    dispatcher({
      type: "delete list",
      data: {
        boardId: currentBoard.id,
        listId: id,
      },
    });
  };
  return (
    <div
      ref={setNodeRefSortable}
      style={style}
      className={`group flex flex-col relative w-60 p-4 cursor-grab rounded max-h-[90vh] h-full overflow-hidden bg-gray-100 ${
        isDragging && "opacity-50"
      } ${isDragOverlay && "cursor-grabbing"}`}
      {...listeners}
      {...attributes}
    >
      <SortableContext items={cards}>
        {isEditing ? (
          <div className="py-4">
            <input
              className="w-full outline outline-gray-300 p-1 rounded text-sm"
              type="text"
              placeholder="Add a title"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
            />
            <div className="w-full flex items-center justify-between py-2">
              <button
                onClick={handleOnSave}
                className="text-sm p-1 rounded bg-sky-700 text-white hover:bg-sky-900 disabled:bg-gray-300"
                disabled={!listTitle}
              >
                Update
              </button>
              <button
                onClick={toggleIsEditing}
                className="text-sm p-1 rounded text-sky-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p
              className="font-bold text-lg py-4 w-full"
              onClick={toggleIsEditing}
            >
              {title}
            </p>
            <div className="gap-2 text-gray-500 hidden group-hover:flex text-sm">
              <button onClick={toggleIsEditing}>Edit</button>
              <button onClick={handleOnDelete}>Delete</button>
            </div>
          </div>
        )}
        {Boolean(cards.length) && (
          <div className="flex flex-col gap-2 overflow-scroll">
            {cards?.map(({ id, ...props }) => (
              <div key={id}>
                <CardDraggableComponent id={id} {...props} />
              </div>
            ))}
          </div>
        )}
        <div
          className={`flex-grow w-full mt-auto ${
            Boolean(cards.length) && "pt-4"
          }`}
        >
          <AddCard listId={id} />
        </div>
      </SortableContext>
    </div>
  );
};

export default ListDroppableComponent;
