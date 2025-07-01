import { NavItem } from "@/types/nav";

interface SiteConfig {
  name: string;
  description: string;
  mainNav: NavItem[];
}

export const siteConfig: SiteConfig = {
  name: "Text2Diagram: Create a diagram with AI",
  description: "Enter your text in natural language or provide your code for seamless diagram creation",
  mainNav: [
  ],
};
