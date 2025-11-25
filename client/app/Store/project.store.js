import { create } from "zustand";

const useProjectStore = create((set) => ({
  projects: [],
  visibleProjects : [],
  isPending: true,
  setPending: (val) => set((state) => ({ isPending: val })),
  setProjects: (data) => set((state) => ({ projects: [...data], visibleProjects : [...data] })),
  setVisibleProjects : (data) => set((state) => ({ visibleProjects : [...data] })),
  createProject: (data) =>
    set((state) => ({ projects: [...state.projects, data] })),
  updateProject: (projectId, data) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project._id === projectId ? { ...project, ...data } : project
      ),
    })),
  deleteProject: (projectId) => {
    set((state) => ({
      projects: state.projects.filter((project) => project._id !== projectId),
    }));
  },
}));

export default useProjectStore;
