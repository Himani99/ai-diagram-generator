import * as React from "react";
import Link from "next/link";

import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className="h-6 w-6 dark:text-white" />
        <span className="font-bold text-xl text-[#6600cc] text-center">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
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
      <Button
        variant="violet"
        className="-ml-4 text-base hover:bg-transparent focus:ring-0 md:hidden dark:text-white"
      >
        <Icons.logo className="mr-2 h-4 w-4" />{" "}
        <span className="text-xl">Generate Diagrams and Flowcharts using GenDiag</span>
      </Button>
    </div>
  );
}
