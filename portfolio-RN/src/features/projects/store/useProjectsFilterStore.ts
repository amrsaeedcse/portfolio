/// Projects Feature Store — local feature-scoped store as per Rule 11 & Rule 2.
/// Manages project list filtering and active modal selection.

import { create } from 'zustand';
import { Project } from '@/constants/data';

export type ProjectFilterType = 'all' | 'mobile' | 'iot' | 'web';

interface ProjectsFilterState {
  activeFilter: ProjectFilterType;
  selectedProject: Project | null;
  setFilter: (filter: ProjectFilterType) => void;
  openProjectDetail: (project: Project) => void;
  closeProjectDetail: () => void;
}

export const useProjectsFilterStore = create<ProjectsFilterState>((set) => ({
  activeFilter: 'all',
  selectedProject: null,
  setFilter: (filter) => set({ activeFilter: filter }),
  openProjectDetail: (project) => set({ selectedProject: project }),
  closeProjectDetail: () => set({ selectedProject: null }),
}));
