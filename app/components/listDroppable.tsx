import { useDroppable } from "@dnd-kit/core";
import CardDraggableComponent, { CardDraggableProps } from "./cardDraggable";
import { SortableContext } from "@dnd-kit/sortable";

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
  activeCardId,
}: ListDroppableProps) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <SortableContext items={cards}>
      <div ref={setNodeRef} className={`w-60 p-4 rounded h-fit bg-gray-100`}>
        <p className="font-bold text-lg py-4">{title}</p>
        <div className=" flex flex-col gap-2 rounded-lg">
          {cards?.map(({ id, ...props }) => (
            <CardDraggableComponent
              key={id}
              id={id}
              activeCardId={activeCardId}
              {...props}
            />
          ))}
        </div>
      </div>
    </SortableContext>
  );
};

export default ListDroppableComponent;
