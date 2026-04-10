"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";

import { authSchema } from "@/lib/auth-schema";

import { loginAction } from "../actions/login";

export function LoginForm(): React.JSX.Element {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    loginAction,
    zodResolver(authSchema),
    {
      formProps: {
        defaultValues: { identifier: "", password: "" },
      },
      actionProps: {
        onError: ({ error }) => {
          notifications.show({ color: "red", message: error.serverError });
        },
      },
    },
  );

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Stack gap="xl" maw={400} mx="auto" mt={100} px="md">
      <Title order={2}>ログイン</Title>

      <form onSubmit={handleSubmitWithAction}>
        <Stack gap="md">
          <TextInput
            label="ニックネームまたはメールアドレス"
            placeholder="ニックネームまたはメールアドレスを入力"
            autoComplete="username"
            error={errors.identifier?.message}
            disabled={action.isExecuting}
            {...register("identifier")}
          />
          <PasswordInput
            label="パスワード"
            placeholder="パスワードを入力"
            autoComplete="current-password"
            error={errors.password?.message}
            disabled={action.isExecuting}
            {...register("password")}
          />

          <Button type="submit" loading={action.isExecuting}>
            ログイン
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
