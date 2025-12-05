import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, reply: "Authentication token missing" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/projects/delete-project/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${token.name}=${token.value}`,
        },
        credentials: "include",
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, reply: data.reply },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        reply: data.reply,
        id: data.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
