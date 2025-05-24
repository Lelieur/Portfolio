import Parser from "rss-parser";
import { MediumPost } from "../types/thougths";

export async function fetchMediumPosts(): Promise<MediumPost[]> {
  const parser = new Parser();
  const feed = await parser.parseURL("https://medium.com/feed/@lelieur.webdev");

  function extractImage(content: string): string | null {
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  }

  const posts: MediumPost[] = feed.items.map((item) => ({
    title: item.title ?? "",
    slug:
      item.title
        ?.toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(" ")
        .join("-") ?? "",
    link: item.link ?? "",
    content: item["content:encoded"] ?? "",
    date: item.pubDate ?? "",
    image: extractImage(item["content:encoded"] ?? "") ?? "",
  }));

  return posts;
}
