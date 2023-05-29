import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
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
                  Create
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
              <div className="flex gap-2 text-sky-900">
                <button
                  onClick={toggleIsEditing}
                  className="w-4 h-4 hidden group-hover:block"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={handleOnDelete}
                  className="w-4 h-4 hidden group-hover:block"
                >
                  <TrashIcon />
                </button>
              </div>
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
