import DndContextComponent from "@/app/components/dndContext";

const fetchBoardsData = async () => {
  const response = await fetch("http://localhost:3000/api/board");
  const boards = await response.json();
  return boards;
};

const BoardPage = async ({ params }: { params: { id: string } }) => {
  const boards = await fetchBoardsData();
  const boardIndex = boards.findIndex(
    (board) => board.id.toString() === params.id
  );
  const { lists } = boards?.[boardIndex];
  return (
    <div className="flex gap-4">
      <DndContextComponent lists={lists} />
    </div>
  );
};

export default BoardPage;
