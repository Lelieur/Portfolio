import { fetchMediumPosts } from "@/lib/fetchMediumPosts";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await fetchMediumPosts();
  return NextResponse.json(posts);
}
