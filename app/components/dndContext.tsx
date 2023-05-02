"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import ListDroppableComponent, { ListDroppableProps } from "./listDroppable";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import CardDraggableComponent, { CardDraggableProps } from "./cardDraggable";

const DndContextComponent = ({ lists }: { lists: ListDroppableProps[] }) => {
  const [listsData, setListsData] = useState(lists);
  const [activeCard, setActiveCard] = useState<CardDraggableProps | null>();

  const activeCardId = activeCard?.id;

  const activeCardList = listsData.find((list) =>
    list?.cards?.find((card) => card.id === activeCardId)
  );

  const activeCardListId = activeCardList?.id;
  const activeCardListIndex = listsData.findIndex(
    (list) => list === activeCardList
  );

  const activeCardData = activeCardList?.cards.find(
    (i) => i.id === activeCardId
  );

  const handleOnDragStart = (event) => {
    setActiveCard(event.active);
  };

  const handleOnDragOver = (event) => {
    const overId = event?.over?.id;

    if (!overId) return;
    if (overId === activeCardId) return;

    setListsData((prev) => {
      const prevCopy = [...prev];

      const overList =
        prev.find((list) => list?.cards?.find((card) => card.id === overId)) ||
        prev.find((list) => list.id === overId);

      const overListId = overList?.id;
      const overListCards = overList?.cards;
      const overListIndex = prevCopy.findIndex((list) => list === overList);

      if (activeCardListId === overListId) return prev;

      const activeCardListUpdatedCards = activeCardList.cards.filter(
        (i) => i.id !== activeCardId
      );

      const overListUpdatedCards = [activeCardData, ...overListCards];

      prevCopy[activeCardListIndex] = {
        ...prevCopy[activeCardListIndex],
        cards: activeCardListUpdatedCards,
      };
      prevCopy[overListIndex] = {
        ...prevCopy[overListIndex],
        cards: overListUpdatedCards,
      };
      return prevCopy;
    });
  };

  const handleOnDragEnd = (event) => {
    const overId = event?.over?.id;
    if (!(overId || activeCardListId)) return;

    setListsData((prev) => {
      const overList =
        prev.find((list) => list?.cards?.find((card) => card.id === overId)) ||
        prev.find((list) => list.id === overId);

      const overListId = overList.id;
      const overListCards = overList.cards;

      const prevCopy = [...prev];

      if (activeCardListId === overListId) {
        // Handles sorting on the same list
        const overListIndex = prevCopy.findIndex(
          (i) => i.id === activeCardListId
        );
        const oldIndex = overListCards.findIndex((i) => i.id === activeCardId);
        const overIdCard = overListCards.find((i) => i.id === overId);
        const newIndex = overIdCard
          ? overListCards.findIndex((i) => i === overIdCard)
          : 0;
        prevCopy[overListIndex] = {
          ...prevCopy[overListIndex],
          cards: arrayMove(overListCards, oldIndex, newIndex),
        };
        return prevCopy;
      }

      return prevCopy;
    });

    setActiveCard(null);
  };

  return (
    <DndContext
      onDragEnd={handleOnDragEnd}
      onDragOver={handleOnDragOver}
      onDragStart={handleOnDragStart}
    >
      {listsData?.map(({ id, ...props }) => (
        <ListDroppableComponent
          key={id}
          id={id}
          activeCardId={activeCardId}
          {...props}
        />
      ))}
      <DragOverlay>
        {activeCardId ? (
          <CardDraggableComponent
            title={activeCardData?.title || ""}
            id={activeCardId}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
export default DndContextComponent;
