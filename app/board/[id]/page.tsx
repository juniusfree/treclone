import BoardIdComponent from "@/app/components/boardId";

export type BoardIdComponentProps = {
  params: {
    id: string;
  };
};

const BoardIdPage = async (props: BoardIdComponentProps) => (
  <BoardIdComponent {...props} />
);

export default BoardIdPage;
