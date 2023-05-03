import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded shadow border px-2 h-10 cursor-pointer flex justify-between bg-gray-50 ${
        isDragging && "opacity-50"
      } `}
      {...listeners}
      {...attributes}
    >
      {title}
    </div>
  );
};

export default CardDraggableComponent;
