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
    <footer className="ui-footer">
      <nav className="ui-footer-nav">
        <ul className="ui-footer-links">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="ui-footer-link"
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
