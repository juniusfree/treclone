"use client";

import Link from "next/link";
import { useBoardDispatcherContext, useBoardsContext } from "./boardsContext";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

const HomeComponent = () => {
  const boards = useBoardsContext();
  const dispatch = useBoardDispatcherContext();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const toggleIsCreating = () => setIsCreating((prev) => !prev);
  const handleOnAdd = () => {
    toggleIsCreating();
    dispatch({
      type: "add board",
      data: {
        title,
      },
    });
  };
  return (
    <div>
      {isCreating ? (
        <div>
          <input
            type="text"
            value={title}
            placeholder="add board title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <button onClick={handleOnAdd}>Add Board</button>
            <button className="w-4 h-4" onClick={toggleIsCreating}>
              <XMarkIcon />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={toggleIsCreating}>Add a new board</button>
      )}
      <ul className="flex flex-col gap-4">
        {boards.map((board) => (
          <li key={board.id}>
            <Link href={`/board/${board.id}`}>
              <div className="w-min-40 p-2 shadow">{board.title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeComponent;
