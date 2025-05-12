import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

export default function Hero() {
  return (
    <section className="flex flex-col gap-4 md:gap-8">
      <p className="text-primary text-base leading-relaxed">
        In professional transition to the world of web development after more
        than three years of experience in agencies and digital marketing
        consultancies as a Project Manager, driven by a constant interest in
        technology.
      </p>
      <div className="flex flex-col gap-2 md:gap-4">
        <Link href="/about" className="w-fit block">
          <span className="group inline text-base">
            <span className="inline underline underline-offset-4 decoration-dotted ">
              Learn more about me
            </span>
            <span className="ml-1 inline-flex whitespace-nowrap">
              👋🏼
              <span className="ml-1 inline-flex aspect-square size-4 align-text-bottom duration-300 my-auto group-hover:translate-x-0.5">
                <ArrowRightIcon />
              </span>
            </span>
          </span>
        </Link>
        <Link href="/about" className="w-fit block">
          <span className="group inline text-base">
            <span className="inline underline underline-offset-4 decoration-dotted ">
              What I&#39;m to now
            </span>
            <span className="ml-1 inline-flex whitespace-nowrap">
              🛠️
              <span className="ml-1 inline-flex aspect-square size-4 align-text-bottom duration-300 my-auto group-hover:translate-x-0.5">
                <ArrowRightIcon />
              </span>
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
