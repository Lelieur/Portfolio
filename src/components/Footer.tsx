import Link from "next/link";
const currentYear = new Date().getFullYear();

export default function Footer() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/experiments", label: "Experiments" },
    { href: "/thoughts", label: "Thoughts" },
    { href: "/about", label: "About" },
  ];

  return (
    <footer className="w-full text-sm">
      <nav className="space-y-8">
        <ul className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-6">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-secondary hover:text-primary hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="leading-normal text-secondary">
          (© 2025 - {currentYear})
        </p>
      </nav>
    </footer>
  );
}
