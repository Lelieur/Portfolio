import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project.model';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    await connectDB();

    const project = await Project.findOne({ slug }).lean();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...project,
      _id: project._id.toString(),
    });
  } catch (error) {
    console.error('[GET /api/projects/[slug]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
