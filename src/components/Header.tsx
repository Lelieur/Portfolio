"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const headerData: Record<string, { title: string }> = {
  "/": {
    title: "Web Developer",
  },
  "/projects": {
    title: "Projects",
  },
  "/about": {
    title: "About",
  },
  "/thoughts": {
    title: "Thoughts",
  },
};

export default function Header() {
  const pathname = usePathname();
  const { title } = headerData[pathname] ?? headerData["/"];
  const [startAnimation, setStartAnimation] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      setStartAnimation(true);
      const timeout = setTimeout(() => {
        setCurrentPath(pathname);
        setStartAnimation(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [pathname, currentPath]);

  const animationClass = !startAnimation
    ? "opacity-100 translate-x-0"
    : "opacity-0 translate-x-[-15px]";

  return (
    <section className="flex items-center gap-2.5 text-sm">
      <Link href="/" className="group flex flex-row items-center gap-3">
        <div className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-emerald opacity-75"></span>
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald"></span>
        </div>
        <p>Lucas Lelieur</p>
      </Link>
      <span className="text-secondary">/</span>
      <p
        className={`text-secondary transition-all duration-100 ease-in-out ${animationClass}`}
      >
        {!startAnimation && title}
      </p>
    </section>
  );
}
