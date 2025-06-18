import Parser from "rss-parser";
import { MediumPost } from "../types/thoughts";
import { extractImage } from "@/utils/extractImage";

export async function fetchMediumPost(
  slug: string
): Promise<MediumPost | null> {
  const parser = new Parser();
  const feed = await parser.parseURL("https://medium.com/feed/@lelieur.webdev");

  const item = feed.items.find((item) => item.link?.includes(slug));

  if (!item) return null;

  return {
    title: item.title ?? "",
    slug,
    link: item.link ?? "",
    content: item["content:encoded"] ?? "",
    date: item.pubDate ?? "",
    image: extractImage(item["content:encoded"] ?? "") ?? "",
  };
}
