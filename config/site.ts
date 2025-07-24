import { NavItem } from "@/types/nav";

interface SiteConfig {
  name: string;
  description: string;
  mainNav: NavItem[];
}

export const siteConfig: SiteConfig = {
  name: "Generate Diagrams and Flowcharts using GenDiag",
  description: "Enter your text in natural language or provide your code for seamless diagram creation",
  mainNav: [
  ],
};
