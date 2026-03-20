import type { Metadata } from "next";

import { RegisterForm } from "./components/register-form";

export const metadata: Metadata = {
  title: "従業員登録",
  description: "新しい従業員アカウントを登録します。",
};

export default function RegisterPage(): React.JSX.Element {
  return <RegisterForm />;
}
