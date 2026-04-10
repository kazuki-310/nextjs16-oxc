"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";

import { authSchema } from "@/lib/auth-schema";

import { registerEmployee } from "../actions/register";

export function RegisterForm(): React.JSX.Element {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    registerEmployee,
    zodResolver(authSchema),
    {
      formProps: {
        defaultValues: { identifier: "", password: "" },
      },
      actionProps: {
        onError: ({ error }) => {
          if (error.serverError) {
            notifications.show({ color: "red", message: error.serverError });
          }
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
      <Title order={2}>従業員登録</Title>

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
            autoComplete="new-password"
            error={errors.password?.message}
            disabled={action.isExecuting}
            {...register("password")}
          />

          <Button type="submit" loading={action.isExecuting}>
            登録
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
