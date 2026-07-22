import NowBlock from "@/components/NowComponents/NowBlock";
import LastUpdated from "@/components/LastUpdated";
import PageTitle from "@/components/PageTitle";

export default function Now() {
  return (
    <main className="ui-main">
      <PageTitle title="Now" description="What I&#39;m doing now?" />
      <section className="ui-section ui-section--divided">
        <NowBlock
          title="🚶🏽‍♂️ Stepping into the dev world!"
          lines={[
            "I didn’t grow up writing code—but I’ve always been drawn to how things work behind the scenes. After years leading digital projects from the strategy side, I decided it was time to get my hands dirty and build the things I once managed.",
            "Now, I’m channeling my background in digital strategy into a new path—one where I don’t just plan ideas, I code them into reality. I’m open to joining new teams where I can keep learning, contribute with purpose, and grow alongside other curious minds.",
          ]}
        />
        <NowBlock
          title="🛠️ Current projects"
          lines={[
            "I’m building FramedIn, a web tool that helps professionals and creators turn their content into polished, LinkedIn-ready carousels—no design software or tech skills needed.",
            "Users can choose from elegant templates, edit text and images in a slide-style interface, add or remove pages, and export everything as a high-quality PDF. It’s all about making communication simpler, faster, and more impactful.",
          ]}
        />
        <NowBlock
          title="👀 Learning and curious"
          lines={[
            "I’m currently leveling up my stack with TypeScript and Next.js to build more scalable and modern applications. At the same time, I’m exploring Three.js and React Three Fiber with the goal of crafting interactive 3D experiences on the web.",
          ]}
        />
      </section>
      <LastUpdated />
    </main>
  );
}
