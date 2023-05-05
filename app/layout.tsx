import { Inter } from "next/font/google";
import BoardsContextComponent from "./components/boardsContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Treclone",
  description: "Trello clone. Created by @juniusfree",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BoardsContextComponent>{children}</BoardsContextComponent>
      </body>
    </html>
  );
}
