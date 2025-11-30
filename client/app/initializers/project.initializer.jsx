"use client"
import React, { useEffect } from "react";
import useProjectStore from "../Store/project.store";

const ProjectInitializer = ({ data }) => {
  const setProjects = useProjectStore((state) => state.setProjects);
  const setPending = useProjectStore((state) => state.setPending);
  useEffect(() => {
    if (!data) {
      return;
    }
    setProjects(data);
    setPending(false);
  }, [data]);

  return null;
};

export default ProjectInitializer;
