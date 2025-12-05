"use client";
import React, { useEffect, useState } from "react";
import ProjectCard from "./Card";
import useProjectStore from "@/app/Store/project.store";
import ShowDialog from "@/components/Dialog";
import { AnimatePresence } from "motion/react";
import Toast from "@/components/Toast";
import AddProjectForm from "./AddProjectForm";
import { Spinner } from "@/components/ui/spinner";

const Cards = () => {
  const projects = useProjectStore((state) => state.visibleProjects);
  const loading = useProjectStore((state) => state.isPending);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [hoveredProject, setHoveredProject] = useState("");

  const [actionClicked, setActionClicked] = useState("");
  const [action, setaction] = useState("");
  const [projectData, setprojectData] = useState({
    text: "",
    id: "",
  });
  const [editingProject, seteditingProject] = useState("");
  const [editingForm, setEditingForm] = useState(false);
  const [isPending, setisPending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, settoastData] = useState({
    message: "",
    type: "",
    isSuccess: false,
  });
  const [initialDetails, setInitialDetails] = useState({});
  const apiUrl = `${process.env.NEXT_PUBLIC_XTASK_FRONTEND}/api/project`;

  const onDelete = async (id) => {
    setisPending(true);
    if (projectData.id === "" || projectData.id.length === 0) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/remove/${projectData.id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
      const response = await res.json();
      if (!response.success) {
        settoastData({
          message: response.reply,
          type: "error",
          isSuccess: false,
        });
        setShowToast(true);
      } else {
        deleteProject(response.id);
        settoastData({
          message: response.reply,
          type: "success",
          isSuccess: false,
        });
        setShowToast(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setisPending(false);
      setActionClicked(false);
      setTimeout(() => {
        setShowToast(false);
        settoastData({
          message: "",
          type: "",
          isSuccess: false,
        });
      }, 2000);
    }
  };
  const onMark = async (id) => {
    setisPending(true);
    if (projectData.id === "" || projectData.id.length === 0) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/edit-project/${projectData.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ completed: true, status: "completed" }),
      });
      const response = await res.json();
      if (!response.success) {
        settoastData({
          message: response.reply,
          type: "error",
          isSuccess: false,
        });
        setShowToast(true);
      } else {
        updateProject(response.updated._id, { completed: true });
        settoastData({
          message: response.reply,
          type: "success",
          isSuccess: false,
        });
        setShowToast(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setisPending(false);
      setActionClicked(false);
      setTimeout(() => {
        setShowToast(false);
        settoastData({
          message: "",
          type: "",
          isSuccess: false,
        });
      }, 2000);
    }
  };
  useEffect(() => {
    projects.forEach((project, idx) => {
      if (project._id === editingProject) {
        setInitialDetails(project);
      }
    });
  }, [editingProject]);

  return (
    <>
      {editingForm && (
        <AddProjectForm
          isOpen={true}
          setIsOpen={setEditingForm}
          editingProject={editingProject}
          projectDetails={initialDetails}
          setActionClicked={setActionClicked}
          seteditingProject={seteditingProject}
        />
      )}
      <AnimatePresence>
        {actionClicked && (
          <ShowDialog
            Data={projectData}
            setActionClicked={setActionClicked}
            onDelete={onDelete}
            action={action}
            seteditingTask={seteditingProject}
            onMark={onMark}
            isPending={isPending}
            setEditingForm={setEditingForm}
          />
        )}
      </AnimatePresence>
      <Toast show={showToast} toastData={toastData} />
      <div className="grid md:mt-5 md:p-0 p-5 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 place-items-center gap-5">
        {loading ? (
          <div className="lg:h-50 lg:col-span-3 h-20 mt-20 lg:mt-0">
            <Spinner className={"text-primary size-5"} />
          </div>
        ) : projects.length < 1 ? (
          <p className="text-muted-foreground text-center lg:col-span-3 mt-10 md:col-span-2 col-span-1">
            No Projects
          </p>
        ) : (
          projects?.map((project, idx) => (
            <ProjectCard
              key={project._id}
              index={idx}
              project={project}
              hoveredProject={hoveredProject}
              setHoveredProject={setHoveredProject}
              onDelete={onDelete}
              onMark={onMark}
              setData={setprojectData}
              setActionClicked={setActionClicked}
              setaction={setaction}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Cards;
