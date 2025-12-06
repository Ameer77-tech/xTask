"use server";

import { redirect } from "next/navigation";

export async function googleRedirect() {
  redirect(`${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/google`);
}

export async function githubRedirect() {
  redirect(`${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/github`);
}
