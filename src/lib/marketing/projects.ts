import type { MarketingProject } from "./types";
import { thsPost } from "./ths-post";
import { crmManagement } from "./crm-management";
import { ecommWebApp } from "./ecomm-web-app";
import { posSystem } from "./pos-system";
import { websiteComplete } from "./website-complete";
import { taimurtoolsDesktop } from "./taimurtools-desktop";

export const PROJECTS: MarketingProject[] = [
  thsPost,
  crmManagement,
  ecommWebApp,
  posSystem,
  websiteComplete,
  taimurtoolsDesktop,
];

export function getProject(id: string): MarketingProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export const PROJECT_IDS = PROJECTS.map((p) => p.id);
