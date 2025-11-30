import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TasksInitializer from "../../initializers/tasks.initializer";
import Main from "./Main";

export default async function TasksSection({ filter, view }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/tasks/get-tasks`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ type: "personal", filter }),
      cache: "no-store",
    }
  );

  const data = await res.json();
  if (!data.success) {
    return redirect("/login");
  }
  const tasks = data.success ? data.tasks : [];

  return (
    <>
      <TasksInitializer taskData={tasks} />
      <Main filter={filter} view={view} />
    </>
  );
}
