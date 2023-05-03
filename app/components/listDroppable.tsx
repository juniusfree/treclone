import { useDroppable } from "@dnd-kit/core";
import CardDraggableComponent, { CardDraggableProps } from "./cardDraggable";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const { setNodeRef } = useDroppable({ id });
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
    <div ref={setNodeRefSortable} style={style} {...listeners} {...attributes}>
      <SortableContext items={cards}>
        <div
          ref={setNodeRef}
          className={`relative w-60 p-4 rounded h-fit bg-gray-100 ${
            isDragging && "opacity-50"
          }`}
        >
          <p className="font-bold text-lg py-4">{title}</p>
          <div className="flex flex-col gap-2">
            {cards?.map(({ id, ...props }) => (
              <CardDraggableComponent key={id} id={id} {...props} />
            ))}
          </div>
        </div>
      </SortableContext>
    </div>
  );
};

export default ListDroppableComponent;
