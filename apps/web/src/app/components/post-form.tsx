"use client";

import { Alert, Button, Stack, Textarea, TextInput } from "@mantine/core";
import { useActionState } from "react";

import { CreatePostState, createPost } from "../actions/create-post";

const initialState: CreatePostState = { status: "idle" };

export function PostForm(): React.JSX.Element {
  const [state, action, isPending] = useActionState(createPost, initialState);

  return (
    <form action={action}>
      <Stack gap="md">
        <TextInput id="title" name="title" label="Title" placeholder="Enter title" required />
        <Textarea
          id="body"
          name="body"
          label="Body"
          placeholder="Write something..."
          rows={5}
          required
          autosize={false}
        />
        {state.status === "error" && (
          <Alert color="red" variant="light">
            {state.error}
          </Alert>
        )}
        {state.status === "success" && (
          <Alert color="green" variant="light">
            Post created successfully.{" "}
            <span style={{ fontFamily: "monospace", fontSize: "0.75em" }}>#{state.id}</span>
          </Alert>
        )}
        <Button type="submit" disabled={isPending} loading={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </Stack>
    </form>
  );
}
