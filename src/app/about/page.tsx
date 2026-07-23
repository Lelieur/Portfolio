import Image from "next/image";
import Link from "next/link";
import "./about.css";
import {
  experiences,
  studies,
  certifications,
  skills,
  languages,
  softSkills,
} from "@/data/aboutData";
import AboutSection from "@/components/AboutComponents/AboutSection";
import LastUpdated from "@/components/LastUpdated";

export default function About() {
  const aboutSections = [
    {
      title: "Experience",
      items: experiences,
    },
    {
      title: "Education",
      items: studies,
    },
    {
      title: "Certifications",
      items: certifications,
    },
    {
      title: "Skills",
      items: skills,
    },
    {
      title: "Soft Skills",
      items: softSkills,
    },
    {
      title: "Languages",
      items: languages,
    },
  ];
  return (
    <main className="ui-main">
      <section className="ui-section">
        <article className="ui-section">
          <div className="ui-section">
            <Image
              src="/lucas-lelieur-webdev.png"
              alt="Lucas Lelieur WebDev"
              width={64}
              height={64}
              className="ui-about-avatar"
            />
            <p className="ui-about-greeting">
              <span className="ui-about-wave">
                👋🏼
              </span>
              Welcome to my byteverse
            </p>
          </div>
          <p className="ui-about-copy">
            You may have guessed it by now, my name is Lucas Lelieur and I&#39;m
            currently transitioning into the web development field after more
            than three years of experience as a Project Manager in digital
            marketing agencies and consultancies.
          </p>
          <p className="ui-about-copy">
            Driven by a strong interest in technology, I recently completed a
            Full Stack Developer Bootcamp at{" "}
            <a
              href="https://www.ironhack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ui-inline-link"
            >
              Ironhack
            </a>
            , specializing in the MERN stack, developing some of the projects
            that you can see in{" "}
            <Link
              href="/projects"
              className="ui-inline-link"
            >
              Projects
            </Link>
            .
          </p>
        </article>
      </section>
      <LastUpdated />
      {aboutSections.map((section) => (
        <AboutSection
          key={section.title}
          title={section.title}
          items={section.items}
        />
      ))}
    </main>
  );
}
