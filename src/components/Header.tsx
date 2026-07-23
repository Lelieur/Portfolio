"use client";

import Link from "next/link";
import Breadcrump from "./BreadCrump/BreadCrump";

import { usePathname } from "next/navigation";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import { ThemePreference } from "@/components/ui";

export default function Header() {
  const pathname = usePathname();
  const breadcrumbs = pathname.split("/").slice(1);

  return (
    <section className="ui-header">
      <Link href="/" className="ui-brand-link group">
        {pathname !== "/" && (
          <ArrowUturnLeftIcon className="size-4 text-secondary group-hover:text-primary" />
        )}
        <div className="ui-brand-indicator">
          <span className="ui-brand-pulse"></span>
          <span className="ui-brand-dot"></span>
        </div>
        <p
          className={`${
            pathname !== "/" && "text-secondary group-hover:text-primary"
          }`}
        >
          Lucas Lelieur
        </p>
      </Link>
      <Breadcrump items={breadcrumbs} />
      <ThemePreference />
    </section>
  );
}
