import SocialLink from "./SocialLink";

export default function SocialLinksSection() {
  const socialLinks = [
    {
      label: "Email",
      href: "mailto:lucas.lelieur.ll@gmail.com",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/lucaslelieur-webdeveloper/",
    },
    {
      label: "GitHub",
      href: "https://github.com/Lelieur",
    },
  ];

  return (
    <section className="flex flex-col gap-4 md:gap-8">
      <p className="text-secondary text-xs uppercase">Connect with me</p>
      <div className="flex flex-col gap-2 md:flex-row md:gap-4">
        {socialLinks.map((link, id) => (
          <SocialLink key={id} {...link} />
        ))}
      </div>
    </section>
  );
}
