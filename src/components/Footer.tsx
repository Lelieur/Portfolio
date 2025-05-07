import Link from "next/link";
const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full text-sm">
      <nav className="text-center space-y-8">
        <ul className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-6">
          <li>
            <Link
              href="/"
              className="text-secondary hover:text-primary hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="text-secondary hover:text-primary hover:underline"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-secondary hover:text-primary hover:underline"
            >
              About
            </Link>
            <li>
              <Link
                href="/about"
                className="text-secondary hover:text-primary hover:underline"
              >
                Thougths
              </Link>
            </li>
          </li>
        </ul>
        <p className="text-secondary">(© 2025 - {currentYear})</p>
      </nav>
    </footer>
  );
}
