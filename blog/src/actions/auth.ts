"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: "Invalid email or password." };
  }

  await createSession({ userId: user.id, email: user.email });
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
