import { useDroppable } from "@dnd-kit/core";
import CardDraggableComponent, { CardDraggableProps } from "./cardDraggable";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddCard from "./addCard";

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
  return (
    <div
      ref={setNodeRefSortable}
      style={style}
      className={`relative w-60 p-4 rounded h-fit bg-gray-100 ${
        isDragging && "opacity-50"
      }`}
      {...listeners}
      {...attributes}
    >
      <SortableContext items={cards}>
        <div ref={setNodeRef}>
          <p className="font-bold text-lg py-4">{title}</p>
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
