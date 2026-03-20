"use client";

import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { authClient } from "@/lib/auth-client";

export function RegisterForm(): React.JSX.Element {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const nickname = formData.get("nickname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      setError("");

      const result = await authClient.signUp.email({ name, email, password, nickname });
      if (result.error) {
        setError(result.error.message ?? "登録に失敗しました");
        return;
      }

      router.push("/");
    });
  };

  return (
    <Stack gap="xl" maw={400} mx="auto" mt={100} px="md">
      <Title order={2}>従業員登録</Title>

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="名前"
            name="name"
            placeholder="名前を入力"
            required
            disabled={isPending}
          />
          <TextInput
            label="ニックネーム"
            name="nickname"
            placeholder="ニックネームを入力"
            required
            disabled={isPending}
          />
          <TextInput
            label="メールアドレス"
            name="email"
            type="email"
            placeholder="メールアドレスを入力"
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
            登録
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
