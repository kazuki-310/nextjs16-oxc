import { getPost } from "../data/posts";
import { PostForm } from "./post-form";

type Props = {
  id: number;
};

export async function PostEditContainer({ id }: Props): Promise<React.JSX.Element> {
  const post = await getPost(id);
  return <PostForm post={{ id: post.id, title: post.title, content: post.content }} />;
}
