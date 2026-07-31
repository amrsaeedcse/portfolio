/// Global Portfolio Zustand Store — enforces discriminated union states.
/// Rule 3 from 02_state_management_zustand.md:
/// Every Zustand store handling async data MUST expose its state as a Discriminated Union.

import { create } from 'zustand';
import { portfolioRepository } from '@/repositories/portfolioRepository';
import { Failure, UnexpectedFailure } from '@/core/errors/failure';
import { Project, SkillGroup, ExperienceItem, kSocialLinks, kContactInfo } from '@/constants/data';

export type PortfolioState =
  | { status: 'idle' }
  | { status: 'loading' }
  | {
      status: 'success';
      projects: Project[];
      skillGroups: SkillGroup[];
      experience: ExperienceItem[];
      aboutStats: Array<[string, string]>;
      socialLinks: typeof kSocialLinks;
      contactInfo: typeof kContactInfo;
    }
  | { status: 'error'; failure: Failure };

interface PortfolioStore {
  state: PortfolioState;
  loadPortfolio: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  state: { status: 'idle' },

  loadPortfolio: async () => {
    // Guard inside the store — prevents double loading as mandated by store rules
    if (get().state.status === 'success') return;
    set({ state: { status: 'loading' } });

    try {
      const [projects, skillGroups, experience, aboutStats, socialLinks, contactInfo] = await Promise.all([
        portfolioRepository.getProjects(),
        portfolioRepository.getSkillGroups(),
        portfolioRepository.getExperience(),
        portfolioRepository.getAboutStats(),
        portfolioRepository.getSocialLinks(),
        portfolioRepository.getContactInfo(),
      ]);

      set({
        state: {
          status: 'success',
          projects,
          skillGroups,
          experience,
          aboutStats,
          socialLinks,
          contactInfo,
        },
      });
    } catch (e) {
      set({ state: { status: 'error', failure: new UnexpectedFailure('failed_to_load_portfolio') } });
    }
  },

  getProjectById: (id: string) => {
    const s = get().state;
    if (s.status === 'success') {
      return s.projects.find((p) => p.id === id);
    }
    return undefined;
  },
}));
