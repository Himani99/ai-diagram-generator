import * as React from "react";
import Link from "next/link";

import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex w-full items-center gap-6 md:gap-10">
      {/* Logo icon only */}
      <Link href="/" className="hidden items-center md:flex">
        <Icons.logo className="h-6 w-6 dark:text-white" />
      </Link>

      <div
        className="mx-auto font-bold text-center text-lg"
        style={{ color: "#6b33b0" }}
      >
        Generate Diagrams and Flowcharts using GenDiag
      </div>

      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-slate-600 hover:text-slate-900 sm:text-sm dark:text-gray-300 dark:hover:text-white",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}