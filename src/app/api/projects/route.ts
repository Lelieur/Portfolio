import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectModel from '@/models/Project.model';
import { ProjectSummary } from '@/types/project';

export async function GET() {
  try {
    await connectDB();
    const rawProjects = await ProjectModel.find({ featured: true })
      .select('title year slug image description')
      .lean();

    const projects: ProjectSummary[] = rawProjects.map((p) => ({
      _id: p._id.toString(),
      title: p.title,
      description: p.description,
      image: p.image,
      year: p.year,
      slug: p.slug,
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}
