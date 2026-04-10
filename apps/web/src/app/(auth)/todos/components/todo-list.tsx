"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Group, Stack, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useHookFormOptimisticAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { type Todo } from "@packages/database";

import { createTodo } from "../actions/create-todo";
import { createTodoSchema } from "../schemas";

type Props = {
  todos: Todo[];
};

export function TodoList({ todos }: Props): React.JSX.Element {
  const { form, action, handleSubmitWithAction, resetFormAndAction } = useHookFormOptimisticAction(
    createTodo,
    zodResolver(createTodoSchema),
    {
      formProps: {
        defaultValues: { title: "" },
      },
      actionProps: {
        currentState: todos,
        updateFn: (currentTodos, input) => [
          {
            id: Date.now(),
            title: input.title,
            done: false,
            authorId: 0,
            createdAt: new Date(),
          } satisfies Todo,
          ...currentTodos,
        ],
        onError: ({ error }) => {
          notifications.show({
            color: "red",
            message: error.serverError ?? "エラーが発生しました",
          });
        },
        onSuccess: () => {
          resetFormAndAction();
        },
      },
    },
  );

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Stack gap="md">
      <form onSubmit={handleSubmitWithAction}>
        <Group gap="sm">
          <TextInput
            placeholder="新しい Todo を入力"
            error={errors.title?.message}
            disabled={action.isPending}
            style={{ flex: 1 }}
            {...register("title")}
          />
          <Button type="submit" loading={action.isPending}>
            追加
          </Button>
        </Group>
      </form>

      {action.optimisticState.length === 0 ? (
        <Text c="dimmed">データがありません</Text>
      ) : (
        <Stack gap="xs">
          {action.optimisticState.map((todo) => (
            <Checkbox key={todo.id} label={todo.title} checked={todo.done} readOnly />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
