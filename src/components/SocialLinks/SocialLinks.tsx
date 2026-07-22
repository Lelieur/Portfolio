import SocialLink from "./SocialLink";

export default function SocialLinksSection() {
  const socialLinks = [
    {
      label: "Resume",
      href: "https://drive.google.com/file/d/1AicP0aUGytWnDqaLEtal3juuX1drnm6q/view?usp=sharing",
    },
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
    <section className="ui-social-section">
      <p className="text-secondary text-xs uppercase">Connect with me</p>
      <div className="ui-social-links">
        {socialLinks.map((link, id) => (
          <SocialLink key={id} {...link} />
        ))}
      </div>
    </section>
  );
}
