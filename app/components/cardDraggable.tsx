import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type CardDraggableProps = {
  title: string;
  id: string;
  activeCardId?: string | null;
};

const CardDraggableComponent = ({
  title,
  id,
  activeCardId,
}: CardDraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActiveCard = activeCardId === id;

  if (isActiveCard) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="group rounded border px-2 h-10 cursor-pointer flex justify-between bg-gray-200"
        {...listeners}
        {...attributes}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded shadow border px-2 h-10 cursor-pointer flex justify-between bg-gray-50"
      {...listeners}
      {...attributes}
    >
      {title}
    </div>
  );
};

export default CardDraggableComponent;
