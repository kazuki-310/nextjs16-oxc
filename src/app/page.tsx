import type { Metadata } from "next";
import { PostForm } from "./_components/post-form";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Fill in the details below to create a new post.",
};

export default function Page(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create Post
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Fill in the details below to create a new post.
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <PostForm />
        </div>
      </div>
    </div>
  );
}
