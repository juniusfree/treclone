import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import AddCard from "./addCard";
import { useBoardIdContext } from "./boardId";
import { useBoardDispatcherContext } from "./boardsContext";
import CardDraggableComponent, { CardDraggableProps } from "./cardDraggable";

export type ListDroppableProps = {
  id: string;
  title: string;
  cards: CardDraggableProps[];
  activeCardId: string | null;
};

const ListDroppableComponent = ({
  title,
  cards = [],
  id,
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
      className={`group relative w-60 p-4 rounded h-fit bg-gray-100 ${
        isDragging && "opacity-50"
      }`}
      {...listeners}
      {...attributes}
    >
      <SortableContext items={cards}>
        <div ref={setNodeRef}>
          {isEditing ? (
            <div>
              <input
                placeholder="Enter a title"
                className="w-full"
                type="text"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
              />
              <div className="flex items-center">
                <button onClick={handleOnSave} disabled={!listTitle.length}>
                  Save
                </button>
                <button onClick={toggleIsEditing} className="h-6 w-6">
                  <XMarkIcon />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg py-4" onClick={toggleIsEditing}>
                {title}
              </p>
              <button
                onClick={handleOnDelete}
                className="w-4 h-4 hidden group-hover:block"
              >
                <TrashIcon />
              </button>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {cards?.map(({ id, ...props }) => (
              <CardDraggableComponent key={id} id={id} {...props} />
            ))}
            <AddCard listId={id} />
          </div>
        </div>
      </SortableContext>
    </div>
  );
};

export default ListDroppableComponent;
