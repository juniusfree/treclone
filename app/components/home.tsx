"use client";

import Link from "next/link";
import { useBoardsContext } from "./boardsContext";

const HomeComponent = () => {
  const boards = useBoardsContext();
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {boards.map((board) => (
          <li key={board.id}>
            <Link href={`/board/${board.id}`}>
              <div className="w-fit p-2 shadow">{board.title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeComponent;
