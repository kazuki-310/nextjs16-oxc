"use client";

import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "../actions/login";

type FormValues = {
  identifier: string;
  password: string;
};

export function LoginForm(): React.JSX.Element {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit } = useForm<FormValues>();

  function onSubmit(values: FormValues): void {
    startTransition(async () => {
      const result = await loginAction(values.identifier, values.password);
      if (!result?.success) {
        notifications.show({
          color: "red",
          message: result.error,
        });
      }
    });
  }

  return (
    <Stack gap="xl" maw={400} mx="auto" mt={100} px="md">
      <Title order={2}>ログイン</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="ニックネームまたはメールアドレス"
            placeholder="ニックネームまたはメールアドレスを入力"
            autoComplete="username"
            disabled={isPending}
            {...register("identifier")}
          />
          <PasswordInput
            label="パスワード"
            placeholder="パスワードを入力"
            autoComplete="current-password"
            disabled={isPending}
            {...register("password")}
          />

          <Button type="submit" loading={isPending}>
            ログイン
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
