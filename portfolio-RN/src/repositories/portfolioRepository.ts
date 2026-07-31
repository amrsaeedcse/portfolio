/// Portfolio Repository — Interface -> Implementation pattern.
/// Rule 3: Every Repository MUST consist of a TypeScript interface and a separate implementation class.
/// Rule 4: Export a ready-to-use singleton instance — never instantiate manually at call sites.

import {
  Project,
  SkillGroup,
  ExperienceItem,
  kProjects,
  kSkillGroups,
  kExperience,
  kAboutStats,
  kSocialLinks,
  kContactInfo,
} from '@/constants/data';

export interface PortfolioRepository {
  getProjects(): Promise<Project[]>;
  getSkillGroups(): Promise<SkillGroup[]>;
  getExperience(): Promise<ExperienceItem[]>;
  getAboutStats(): Promise<Array<[string, string]>>;
  getSocialLinks(): Promise<typeof kSocialLinks>;
  getContactInfo(): Promise<typeof kContactInfo>;
}

class PortfolioRepositoryImpl implements PortfolioRepository {
  async getProjects(): Promise<Project[]> {
    return kProjects;
  }

  async getSkillGroups(): Promise<SkillGroup[]> {
    return kSkillGroups;
  }

  async getExperience(): Promise<ExperienceItem[]> {
    return kExperience;
  }

  async getAboutStats(): Promise<Array<[string, string]>> {
    return kAboutStats;
  }

  async getSocialLinks(): Promise<typeof kSocialLinks> {
    return kSocialLinks;
  }

  async getContactInfo(): Promise<typeof kContactInfo> {
    return kContactInfo;
  }
}

// Export the singleton instance as required by Rule 4
export const portfolioRepository: PortfolioRepository = new PortfolioRepositoryImpl();
