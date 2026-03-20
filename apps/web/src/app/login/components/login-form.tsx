"use client";

import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { signIn } from "@/lib/auth-client";

import { resolveEmail } from "../actions/login";

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      setError("");

      const email = await resolveEmail(identifier);
      if (!email) {
        setError("ユーザーが見つかりません");
        return;
      }

      const result = await signIn.email({ email, password });
      if (result.error) {
        setError("メールアドレス/ニックネームまたはパスワードが正しくありません");
        return;
      }

      router.push("/");
    });
  };

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
          />
          <PasswordInput
            label="パスワード"
            name="password"
            placeholder="パスワードを入力"
            required
            disabled={isPending}
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
