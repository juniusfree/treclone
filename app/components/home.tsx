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
    setTitle("");
  };
  return (
    <div className="flex flex-col gap-8 p-8 w-full">
      <div className="text-lg font-bold">Treclone</div>
      <ul className="flex flex-wrap gap-4">
        {boards.map((board) => (
          <li
            key={board.id}
            className="w-48 p-2 h-24 bg-gray-200 cursor-pointer rounded font-semibold hover:bg-gray-500"
          >
            <Link href={`/board/${board.id}`}>
              <div className="h-full w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {board.title}
              </div>
            </Link>
          </li>
        ))}
        <li key="new-board" className="w-48 h-24">
          {isCreating ? (
            <div className="p-2 flex flex-col justify-between h-full bg-gray-200 rounded">
              <input
                autoFocus
                className="w-full outline outline-gray-300 p-1 rounded text-sm"
                type="text"
                value={title}
                placeholder="Enter board title"
                onChange={(e) => setTitle(e.target.value)}
                maxLength={20}
              />
              <div className="w-full flex items-center justify-between py-2">
                <button
                  onClick={handleOnAdd}
                  className={`text-sm p-1 rounded bg-sky-700 text-white hover:bg-sky-900 disabled:bg-gray-300`}
                  disabled={!title}
                >
                  Create
                </button>
                <button
                  onClick={toggleIsCreating}
                  className="text-sm p-1 rounded text-sky-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={toggleIsCreating}
              className="cursor-pointer h-full w-full text-sm flex items-center justify-center p-2 bg-gray-200 hover:bg-gray-500 rounded"
            >
              Create a new board
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default HomeComponent;
