"use client";

import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setError("");
      const result = await signIn("credentials", {
        redirect: false,
        identifier: String(formData.get("identifier") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      });
      if (result?.error) {
        setError("メールアドレス/ニックネームまたはパスワードが正しくありません");
        return;
      }
      router.push("/");
    });
  }

  return (
    <Stack gap="xl" maw={400} mx="auto" mt={100} px="md">
      <Title order={2}>ログイン</Title>

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
            autoComplete="current-password"
          />

          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}

          <Button type="submit" loading={isPending}>
            ログイン
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
