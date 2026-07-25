"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  changePassword,
  login,
  logout,
  refreshSession,
  requestPasswordReset,
  revokeSession,
  updateUserProfile,
  verifyEmail
} from "./auth-client";
import { SESSION_COOKIE_NAME } from "./api-client";

const SESSION_COOKIE_MAX_AGE_SECONDS = 8 * 60 * 60;

export async function loginAction(formData: FormData): Promise<void> {
  const returnTo = safeReturnTo(readOptionalString(formData, "returnTo"));
  const result = await login({
    displayName: readOptionalString(formData, "displayName"),
    email: readRequiredString(formData, "email"),
    loginSecret: readOptionalString(formData, "loginSecret"),
    organizationName: readOptionalString(formData, "organizationName"),
    password: readOptionalString(formData, "password")
  });

  if (result.error || !result.data) {
    redirect(`/login?error=login&returnTo=${encodeURIComponent(returnTo)}`);
  }

  await setSessionCookie(result.data.session.token);
  revalidatePath("/");
  redirect(returnTo);
}

export async function logoutAction(): Promise<void> {
  await logout();
  await clearSessionCookie();
  redirect("/login");
}

export async function refreshSessionAction(): Promise<void> {
  const result = await refreshSession();

  if (result.data?.session.token) {
    await setSessionCookie(result.data.session.token);
  }

  revalidatePath("/sessions");
  redirect("/sessions");
}

export async function requestPasswordResetAction(formData: FormData): Promise<void> {
  const result = await requestPasswordReset({
    email: readRequiredString(formData, "email"),
    newPassword: readOptionalString(formData, "newPassword"),
    token: readOptionalString(formData, "token")
  });

  if (result.error) {
    redirect("/reset-password?error=reset");
  }

  redirect("/reset-password?status=accepted");
}

export async function changePasswordAction(formData: FormData): Promise<void> {
  const result = await changePassword({
    currentPassword: readOptionalString(formData, "currentPassword"),
    newPassword: readRequiredString(formData, "newPassword")
  });

  if (result.error) {
    redirect("/change-password?error=change");
  }

  redirect("/change-password?status=changed");
}

export async function verifyEmailAction(formData: FormData): Promise<void> {
  await verifyEmail({
    email: readRequiredString(formData, "email"),
    token: readOptionalString(formData, "token")
  });
  redirect("/profile");
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const result = await updateUserProfile({
    displayName: readRequiredString(formData, "displayName")
  });

  if (result.error) {
    redirect("/profile?error=profile");
  }

  revalidatePath("/profile");
  redirect("/profile?status=updated");
}

export async function revokeSessionAction(formData: FormData): Promise<void> {
  const sessionId = readRequiredString(formData, "sessionId");
  const result = await revokeSession(sessionId);

  if (result.error) {
    redirect("/sessions?error=sessions");
  }

  revalidatePath("/sessions");
  redirect("/sessions");
}

async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    domain: process.env.SESSION_COOKIE_DOMAIN,
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    domain: process.env.SESSION_COOKIE_DOMAIN,
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

function safeReturnTo(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  if (value === "/login" || value.startsWith("/login?")) {
    return "/dashboard";
  }

  return value;
}

function readRequiredString(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function readOptionalString(formData: FormData, fieldName: string): string | undefined {
  const value = readRequiredString(formData, fieldName);

  return value.length > 0 ? value : undefined;
}
