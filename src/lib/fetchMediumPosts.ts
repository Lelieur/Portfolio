import Parser from "rss-parser";
import { MediumPost } from "../types/thoughts";
import { extractImage } from "@/utils/extractImage";

export async function fetchMediumPosts(): Promise<MediumPost[]> {
  const parser = new Parser();
  const feed = await parser.parseURL("https://medium.com/feed/@lelieur.webdev");

  const posts: MediumPost[] = feed.items.map((item) => ({
    title: item.title ?? "",
    slug: item.link?.split("/").filter(Boolean).pop() ?? "",
    link: item.link ?? "",
    content: item["content:encoded"] ?? "",
    date: item.pubDate ?? "",
    image: extractImage(item["content:encoded"] ?? "") ?? "",
  }));

  return posts;
}
