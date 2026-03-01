"use client";

import { useActionState } from "react";
import { CreatePostState, createPost } from "../_server-functions/actions/create-post";

const initialState: CreatePostState = { status: "idle" };

export function PostForm(): React.JSX.Element {
  const [state, action, isPending] = useActionState(createPost, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter title"
          required
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          placeholder="Write something..."
          required
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent transition resize-none"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      {state.status === "success" && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-4 py-3">
          <p className="text-sm text-green-700 dark:text-green-300">
            Post created successfully.{" "}
            <span className="font-mono text-xs text-green-600 dark:text-green-400">
              #{state.id}
            </span>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
