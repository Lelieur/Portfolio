import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProjectModel from "@/models/Project.model";
import { ProjectSummary } from "@/types/project";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    await connectDB();

    const filter = category ? { "details.category": category } : {};

    const rawProjects = await ProjectModel.find(filter)
      .select("title year slug image description details")
      .lean();

    const projects: ProjectSummary[] = rawProjects.map((p) => ({
      _id: p._id.toString(),
      title: p.title,
      description: p.description,
      image: p.image,
      year: p.year,
      slug: p.slug,
      details: p.details,
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error fetching projects" },
      { status: 500 }
    );
  }
}
