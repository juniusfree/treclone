"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import AddListComponent from "./addList";
import { useBoardIdContext } from "./boardId";
import { findList, useBoardDispatcherContext } from "./boardsContext";
import CardDraggableComponent from "./cardDraggable";
import ListDroppableComponent from "./listDroppable";

const DndContextComponent = () => {
  const currentBoard = useBoardIdContext();
  const dispatch = useBoardDispatcherContext();
  const listsData = currentBoard?.lists;
  const [activeDraggableId, setActiveDraggableId] =
    useState<UniqueIdentifier>("");
  const activeDraggableList = findList(listsData, activeDraggableId);
  const activeDraggableListId = activeDraggableList?.id;
  const activeCardData = activeDraggableList?.cards.find(
    (card) => card.id === activeDraggableId
  );

  const handleOnDragStart = (event: DragStartEvent) => {
    setActiveDraggableId(event.active.id);
  };

  const handleOnDragOver = (event: DragOverEvent) => {
    const overId = event?.over?.id;

    if (!overId || overId === activeDraggableId) return;

    const overListId = findList(listsData, overId)?.id;
    if (activeDraggableListId === overListId) return;

    if (activeCardData) {
      // handles sorting when a card is dragged
      dispatch({
        type: "move card",
        data: {
          activeCardData,
          activeDraggableId,
          boardId: currentBoard.id,
          overId,
        },
      });
      return;
    }

    dispatch({
      type: "sort lists",
      data: {
        overId,
        activeDraggableId,
        boardId: currentBoard.id,
      },
    });
  };

  const handleOnDragEnd = (event: DragEndEvent) => {
    const overId = event?.over?.id;
    if (!(overId || activeDraggableListId) || !activeCardData) return;

    dispatch({
      type: "sort cards",
      data: {
        boardId: currentBoard.id,
        activeDraggableId,
        overId,
      },
    });
    setActiveDraggableId("");
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  return (
    <DndContext
      onDragEnd={handleOnDragEnd}
      onDragOver={handleOnDragOver}
      onDragStart={handleOnDragStart}
      sensors={sensors}
    >
      <SortableContext items={listsData}>
        <div className="flex items-start gap-4">
          {listsData?.map(({ id, ...props }) => (
            <ListDroppableComponent key={id} id={id} {...props} />
          ))}
          <AddListComponent />
        </div>
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
