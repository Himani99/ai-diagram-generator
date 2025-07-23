import "./globals.css";

import { Analytics } from "@vercel/analytics/react";

import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/SiteHeader";
import { ContextProvider } from "./context";

export const metadata = {
  title: "Generate Diagrams and Flowcharts using GenDiag",
  description:
    "Create flowcharts, sequence diagrams, class diagrams, user journeys, Gantt charts, C4 models, mind maps, and timelines effortlessly — just by using natural language. GenDiag turns your ideas into professional diagrams in seconds.",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-white font-sans text-slate-900 antialiased flex flex-col",
          fontSans.variable
        )}
      >
        <ContextProvider>
          <SiteHeader />
          {children}
          <Analytics />
        </ContextProvider>
      </body>
    </html>
  );
}
