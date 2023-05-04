import BoardContextComponent from "@/app/components/BoardDataContext";
import DndContextComponent from "@/app/components/dndContext";

const BoardPage = async ({ params }: { params: { id: string } }) => (
  <BoardContextComponent boardId={params.id} />
);

export default BoardPage;
