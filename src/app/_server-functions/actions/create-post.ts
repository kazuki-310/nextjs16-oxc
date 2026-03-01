"use server";

export type CreatePostState =
  | { status: "idle" }
  | { status: "success"; id: string }
  | { status: "error"; error: string };

export async function createPost(
  _prev: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || !title.trim()) {
    return { status: "error", error: "Title is required" };
  }

  if (typeof body !== "string" || !body.trim()) {
    return { status: "error", error: "Body is required" };
  }

  // Fake insert
  return { status: "success", id: "post-1" };
}
