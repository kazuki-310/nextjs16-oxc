"use client";

import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { registerEmployee } from "../actions/register";

export function RegisterForm(): React.JSX.Element {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setError("");
      const identifier = String(formData.get("identifier") ?? "").trim();
      const password = String(formData.get("password") ?? "");

      const result = await registerEmployee({ identifier, password });
      if (!result.ok) {
        setError(result.message);
        return;
      }

      const signInResult = await signIn("credentials", {
        identifier: result.signInIdentifier,
        password,
        redirect: false,
      });
      if (signInResult?.error) {
        setError("登録は完了しましたがログインに失敗しました");
        return;
      }

      router.push("/");
    });
  }

  return (
    <Stack gap="xl" maw={400} mx="auto" mt={100} px="md">
      <Title order={2}>従業員登録</Title>

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="ニックネームまたはメールアドレス"
            name="identifier"
            placeholder="ニックネームまたはメールアドレスを入力"
            required
            disabled={isPending}
            autoComplete="username"
          />
          <PasswordInput
            label="パスワード"
            name="password"
            placeholder="パスワードを入力"
            required
            disabled={isPending}
            autoComplete="new-password"
          />

          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}

          <Button type="submit" loading={isPending}>
            登録
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
