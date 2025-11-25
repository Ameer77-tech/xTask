import useProjectStore from "@/app/Store/project.store";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Filter({ filter }) {
  const filters = ["All", "Completed", "In-progress"];
  const projects = useProjectStore((state) => state.projects);
  const setVisibleProjects = useProjectStore(
    (state) => state.setVisibleProjects
  );
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    if (projects.length < 1) return;

    const filtered = projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setVisibleProjects(filtered);
  }, [searchTerm, projects]);

  return (
    <div className="md:flex md:flex-row flex-col md:justify-between px-3 md:mt-0 mt-5">
      <div className="md:w-1/2 w-full flex items-center gap-2 bg-secondary rounded-2xl p-1 px-3">
        <Search color="#93959a" />
        <Input
          onChange={(e) => setsearchTerm(e.target.value)}
          className="text-secondary-foreground border-0 p-2"
          placeholder="Search for projects by title or description"
        />
      </div>

      <div className="md:flex gap-2 items-center grid grid-cols-2 md:mt-0 mt-5 place-items-center">
        {filters.map((name, idx) => {
          return (
            <Link
              href={`/projects?filter=${name.toLowerCase().trim()}`}
              key={idx}
              className={clsx(
                "select-none shadow-sm md:w-auto w-full shadow-muted-foreground/20 rounded-2xl px-3 py-2 cursor-pointer",
                filter === name.toLowerCase()
                  ? "bg-accent text-black"
                  : "bg-secondary"
              )}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
