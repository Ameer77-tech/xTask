// app/api/logout/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookieStore = await cookies();

  // Delete the cookie by setting maxAge: 0
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // must match the original cookie path
    maxAge: 0, // expires immediately
  });
  console.log(cookieStore);
  return NextResponse.json({ success: true, message: "Logged out" });
}
