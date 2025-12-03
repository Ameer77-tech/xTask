import AppSideBar from "@/components/SideBar";
import Main from "./components/Main";
import { cookies } from "next/headers";
import UserInitializer from "../initializers/user.initializer";
import { redirect } from "next/navigation";

const page = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const getUserData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/get-user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },

        cache: "no-store",
      }
    );

    let data = await res.json();

    if (data.reply === "Unauthorized") {
      redirect("/login");
    } else if (!data.success) {
      alert(data.reply);
      return;
    } else {
      return data;
    }
  };
  const userData = await getUserData();
  return (
    <>
      <UserInitializer userData={userData}></UserInitializer>
      <div className="h-screen w-screen flex justify-start">
        <AppSideBar />
        <Main userData={userData.reply} />
      </div>
    </>
  );
};
export default page;
