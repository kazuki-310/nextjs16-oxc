"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { type Memo } from "@packages/database";
import { useOptimisticAction } from "next-safe-action/hooks";

import { createMemo } from "../actions/create-memo";
import { deleteMemo } from "../actions/delete-memo";
import { createMemoSchema } from "../schemas";

type MemoListProps = {
  memos: Memo[];
};

export function MemoList({ memos }: MemoListProps): React.JSX.Element {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    createMemo,
    zodResolver(createMemoSchema),
    {
      formProps: {
        defaultValues: { title: "", body: "" },
      },
      actionProps: {
        onError: ({ error }) => {
          notifications.show({
            color: "red",
            message: error.serverError ?? "エラーが発生しました",
          });
        },
        onSuccess: () => {
          form.reset();
        },
      },
    },
  );

  const {
    register,
    formState: { errors },
  } = form;

  const { execute: executeDelete, optimisticState: optimisticMemos } = useOptimisticAction(
    deleteMemo,
    {
      currentState: memos,
      updateFn: (current, input) => current.filter((m) => m.id !== input.id),
      onError: ({ error }) => {
        notifications.show({
          color: "red",
          message: error.serverError ?? "エラーが発生しました",
        });
      },
    },
  );

  return (
    <Stack gap="lg">
      <form onSubmit={handleSubmitWithAction}>
        <Stack gap="md">
          <TextInput
            label="タイトル"
            placeholder="メモのタイトル"
            error={action.result.validationErrors?.fieldErrors?.title?.[0] || errors.title?.message}
            disabled={action.isExecuting}
            {...register("title")}
          />
          <Textarea
            label="本文"
            placeholder="内容を入力"
            error={action.result.validationErrors?.fieldErrors?.body?.[0] || errors.body?.message}
            disabled={action.isExecuting}
            autosize
            minRows={4}
            {...register("body")}
          />
          <Button type="submit" loading={action.isExecuting}>
            保存
          </Button>
        </Stack>
      </form>

      {optimisticMemos.length === 0 ? (
        <Text c="dimmed">メモはまだありません</Text>
      ) : (
        <Stack gap="sm">
          {optimisticMemos.map((memo) => (
            <Card key={memo.id} withBorder padding="md" radius="md">
              <Stack gap="xs">
                <Text fw={600}>{memo.title}</Text>
                <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                  {memo.body}
                </Text>
                <Text size="xs" c="dimmed">
                  更新: {memo.updatedAt.toLocaleString("ja-JP")}
                </Text>
                <Group justify="flex-end">
                  <Button
                    color="red"
                    variant="light"
                    size="xs"
                    onClick={() => {
                      executeDelete({ id: memo.id });
                    }}
                  >
                    削除
                  </Button>
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
