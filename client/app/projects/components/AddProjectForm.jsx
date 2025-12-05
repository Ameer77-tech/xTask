"use client";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useProjectStore from "@/app/Store/project.store";

const defaultProjectState = {
  title: "",
  description: "",
  dueDate: "",
  priority: 2,
  status: "not-started",
};

const AddProjectForm = ({
  isOpen,
  setIsOpen,
  editingProject,
  projectDetails,
  setActionClicked,
  seteditingProject,
}) => {
  const [projectData, setProjectData] = useState(
    projectDetails === undefined ? defaultProjectState : projectDetails
  );

  useEffect(() => {
    if (projectDetails) {
      setProjectData({
        title: projectDetails.title ?? "",
        description: projectDetails.description ?? "",
        dueDate: projectDetails.dueDate ?? "",
        priority: Number(projectDetails.priority) || 2,
        status: projectDetails.status ?? "not-started",
      });
    } else {
      setProjectData(defaultProjectState);
    }
  }, [projectDetails]);

  const createProject = useProjectStore((state) => state.createProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({
    message: "",
    type: "",
    isSuccess: false,
  });
  const [isPending, setIsPending] = useState(false);
  const isPlanning = projectData.status === "planning";

  const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

  const showError = (msg) => {
    setToastData({ message: msg, type: "error", isSuccess: false });
    setShowToast(true);
  };

  const handleChange = (e) => {
    setProjectData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePriorityChange = (value) => {
    if (value == "") {
      setProjectData((prev) => ({
        ...prev,
        priority: Number(projectData.priority),
      }));
    }
    setProjectData((prev) => ({
      ...prev,
      priority: Number(value),
    }));
  };

  const validate = () => {
    if (!projectData.title.trim()) return showError("Title is required");
    if (!projectData.dueDate) return showError("Due date is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsPending(true);
    try {
      const response = await fetch(`${apiUrl}/add`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(projectData),
      });
      const res = await response.json();
      if (!res.success) {
        setShowToast(true);
        setToastData({
          message: res.reply,
          type: "error",
          isSuccess: false,
        });
      } else {
        createProject(res.created);
        setShowToast(true);
        setToastData({
          message: res.reply,
          type: "success",
          isSuccess: true,
        });
      }
    } catch (err) {
      console.log(err);
      setShowToast(true);
      setToastData({
        message: "Server Error",
        type: "error",
        isSuccess: false,
      });
    } finally {
      setIsPending(false);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
      setIsOpen(false);
      setProjectData(defaultProjectState);
    }
  };

  const apiUrl = `${process.env.NEXT_PUBLIC_XTASK_FRONTEND}/api/project`;

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsPending(true);
    if (editingProject.length === 0) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/update/${editingProject}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(projectData),
      });
      const response = await res.json();
      if (!response.success) {
        setToastData({
          message: response.reply,
          type: "error",
          isSuccess: false,
        });
        setShowToast(true);
      } else {
        console.log(response.updated._id);
        updateProject(response.updated._id, response.updated);
        setToastData({
          message: response.reply,
          type: "success",
          isSuccess: false,
        });
        setShowToast(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsPending(false);
      setActionClicked(false);
      seteditingProject("");
      setTimeout(() => {
        setShowToast(false);
        setToastData({
          message: "",
          type: "",
          isSuccess: false,
        });
      }, 2000);
    }
  };

  return (
    <>
      <Toast key="toast" show={showToast} toastData={toastData} />
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setIsOpen(false);
                setProjectData(defaultProjectState);
              }}
            />

            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-full max-w-md bg-secondary p-6 shadow-2xl rounded-xl relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setProjectData(defaultProjectState);
                  }}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-2 text-center">
                  {editingProject ? "Edit Project" : "🚀 Create New Project"}
                </h2>

                <p className="text-center text-gray-500 mb-6">
                  {editingProject
                    ? "Edit the Details of Your Project"
                    : "Enter the details for your new Project below."}
                </p>

                <form
                  onSubmit={editingProject ? handleEdit : handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={projectData.title || ""}
                      onChange={handleChange}
                      placeholder="e.g., Portfolio Website Redesign"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={projectData.description || ""}
                      onChange={handleChange}
                      placeholder="Detailed notes or requirements..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      required
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formatDate(projectData.dueDate || "")}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={String(projectData.priority)}
                      onValueChange={(value) =>
                        handlePriorityChange(
                          value === "" ? projectData.priority : value
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">High</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex justify-between">
                    <Label htmlFor="planning">Still Planning?</Label>
                    <Switch
                      checked={isPlanning}
                      onCheckedChange={(checked) =>
                        setProjectData((prev) => ({
                          ...prev,
                          status: checked ? "planning" : "not-started",
                        }))
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending
                      ? editingProject
                        ? "Updating..."
                        : "Adding..."
                      : editingProject
                      ? "Edit Project"
                      : "Add Project"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddProjectForm;
