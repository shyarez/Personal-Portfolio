import { isSupabaseConfigured } from "@/lib/env";
import { LoginForm } from "./login-form";
import { SetupNotice } from "../setup-notice";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      {isSupabaseConfigured() ? <LoginForm /> : <SetupNotice />}
    </main>
  );
}
