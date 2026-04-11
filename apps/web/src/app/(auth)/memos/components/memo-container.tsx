import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { getMemosForEmployee } from "../data/memos";
import { MemoList } from "./memo-list";

export async function MemoContainer(): Promise<React.JSX.Element> {
  const session = await auth();
  const authorId = session?.user?.id ? parseInt(session.user.id, 10) : NaN;
  if (!Number.isInteger(authorId) || authorId <= 0) {
    redirect("/login");
  }

  const memos = await getMemosForEmployee(authorId);
  return <MemoList memos={memos} />;
}
