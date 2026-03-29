"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, Textarea, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";

import { createPost } from "../actions/create-post";
import { updatePost } from "../actions/update-post";
import { createPostSchema, updatePostSchema } from "../schemas";

type Props = {
  post?: { id: number; title: string; content: string };
};

const actionErrorToast = {
  onError: ({ error }: { error: { serverError?: string } }) => {
    notifications.show({
      color: "red",
      message: error.serverError ?? "エラーが発生しました",
    });
  },
};

function PostFormCreate(): React.JSX.Element {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    createPost,
    zodResolver(createPostSchema),
    {
      formProps: {
        defaultValues: { title: "", content: "" },
      },
      actionProps: actionErrorToast,
    },
  );

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmitWithAction}>
      <Stack gap="md">
        <TextInput
          label="タイトル"
          placeholder="タイトルを入力"
          error={errors.title?.message}
          disabled={action.isExecuting}
          {...register("title")}
        />
        <Textarea
          label="本文"
          placeholder="本文を入力"
          error={errors.content?.message}
          disabled={action.isExecuting}
          autosize
          minRows={5}
          {...register("content")}
        />
        <Button type="submit" loading={action.isExecuting}>
          作成
        </Button>
      </Stack>
    </form>
  );
}

function PostFormEdit({
  post,
}: {
  post: { id: number; title: string; content: string };
}): React.JSX.Element {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    updatePost,
    zodResolver(updatePostSchema),
    {
      formProps: {
        defaultValues: {
          id: post.id,
          title: post.title,
          content: post.content,
        },
      },
      actionProps: actionErrorToast,
    },
  );

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmitWithAction}>
      <input type="hidden" {...register("id", { valueAsNumber: true })} />
      <Stack gap="md">
        <TextInput
          label="タイトル"
          placeholder="タイトルを入力"
          error={errors.title?.message}
          disabled={action.isExecuting}
          {...register("title")}
        />
        <Textarea
          label="本文"
          placeholder="本文を入力"
          error={errors.content?.message}
          disabled={action.isExecuting}
          autosize
          minRows={5}
          {...register("content")}
        />
        <Button type="submit" loading={action.isExecuting}>
          更新
        </Button>
      </Stack>
    </form>
  );
}

export function PostForm({ post }: Props): React.JSX.Element {
  if (post !== undefined) {
    return <PostFormEdit post={post} />;
  }
  return <PostFormCreate />;
}
