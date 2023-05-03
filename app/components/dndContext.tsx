"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import ListDroppableComponent, { ListDroppableProps } from "./listDroppable";
import CardDraggableComponent, { CardDraggableProps } from "./cardDraggable";

const findList = (lists?: ListDroppableProps[], id?: UniqueIdentifier) =>
  lists?.find((list) => list?.cards?.find((card) => card.id === id)) ||
  lists?.find((list) => list.id === id);

const DndContextComponent = ({ lists }: { lists: ListDroppableProps[] }) => {
  const [listsData, setListsData] = useState<ListDroppableProps[] | undefined>(
    lists
  );
  const [activeDraggableId, setActiveDraggableId] =
    useState<UniqueIdentifier>("");
  const activeDraggableList = findList(listsData, activeDraggableId);
  const activeDraggableListId = activeDraggableList?.id;
  const activeDraggableListIndex = listsData?.findIndex(
    (list) => list === activeDraggableList
  );
  const activeCardData = activeDraggableList?.cards.find(
    (card) => card.id === activeDraggableId
  );

  const handleOnDragStart = (event: DragStartEvent) => {
    setActiveDraggableId(event.active.id);
  };

  const handleOnDragOver = (event: DragOverEvent) => {
    const overId = event?.over?.id;

    if (!overId || overId === activeDraggableId) return;

    setListsData((prev) => {
      const prevCopy = [...prev];

      const overList = findList(prev, overId);
      const overListId = overList?.id;
      const overListCards = overList?.cards;
      const overListIndex = prevCopy.findIndex((list) => list === overList);

      if (activeDraggableListId === overListId) return prev;

      if (activeCardData) {
        // handles sorting when a card is dragged
        const activeDraggableListUpdatedCards =
          activeDraggableList?.cards.filter((i) => i.id !== activeDraggableId);

        const overListUpdatedCards = [activeCardData, ...overListCards];

        prevCopy[activeDraggableListIndex] = {
          ...prevCopy[activeDraggableListIndex],
          cards: activeDraggableListUpdatedCards,
        };
        prevCopy[overListIndex] = {
          ...prevCopy[overListIndex],
          cards: overListUpdatedCards,
        };
        return prevCopy;
      }

      prevCopy[overListIndex] = activeDraggableList;
      prevCopy[activeDraggableListIndex] = overList;

      return prevCopy;
    });
  };

  const handleOnDragEnd = (event: DragEndEvent) => {
    const overId = event?.over?.id;
    if (!(overId || activeDraggableListId) || !activeCardData) return;

    setListsData((prev) => {
      const overList = findList(prev, overId);
      const overListId = overList?.id;
      const overListCards = overList?.cards;

      const prevCopy = [...prev];

      if (activeDraggableListId === overListId) {
        // Handles sorting on the same list
        const overListIndex = prevCopy.findIndex(
          (i) => i.id === activeDraggableListId
        );
        const oldIndex = overListCards?.findIndex(
          (i) => i.id === activeDraggableId
        );
        const overIdCard = overListCards?.find((i) => i.id === overId);
        const newIndex = overIdCard
          ? overListCards?.findIndex((i) => i === overIdCard)
          : 0;
        prevCopy[overListIndex] = {
          ...prevCopy[overListIndex],
          cards: arrayMove(overListCards, oldIndex, newIndex),
        };
        return prevCopy;
      }

      return prevCopy;
    });

    setActiveDraggableId("");
  };

  return (
    <DndContext
      onDragEnd={handleOnDragEnd}
      onDragOver={handleOnDragOver}
      onDragStart={handleOnDragStart}
    >
      <SortableContext items={listsData}>
        {listsData?.map(({ id, ...props }) => (
          <ListDroppableComponent key={id} id={id} {...props} />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeCardData ? (
          <CardDraggableComponent {...activeCardData} />
        ) : (
          <ListDroppableComponent {...activeDraggableList} />
        )}
      </DragOverlay>
    </DndContext>
  );
};
export default DndContextComponent;
