"use client";

import Link from "next/link";
import Breadcrump from "./BreadCrump/BreadCrump";

import { usePathname } from "next/navigation";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";

export default function Header() {
  const pathname = usePathname();
  const breadcrumbs = pathname.split("/").slice(1);

  return (
    <section className="flex items-center gap-2.5 text-sm">
      <Link href="/" className="group flex flex-row items-center gap-3">
        {pathname !== "/" && (
          <ArrowUturnLeftIcon className="size-4 text-secondary group-hover:text-primary" />
        )}
        <div className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-emerald opacity-75"></span>
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald"></span>
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
    </section>
  );
}
