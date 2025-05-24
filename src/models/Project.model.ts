import mongoose, { Schema, Document, models } from "mongoose";
import { AboutDetails } from "@/types/project";

export interface ProjectType extends Document {
  title: string;
  description: string;
  image: string;
  year: string;
  slug: string;
  featured: boolean;
  details: Record<string, string>;
  about: AboutDetails[];
}

const ProjectSchema = new Schema<ProjectType>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    year: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    featured: { type: Boolean, default: false },
    details: {
      type: [String],
      default: undefined,
    },
    about: {
      type: [
        {
          title: { type: String, required: true },
          content: { type: Schema.Types.Mixed, required: true },
          links: {
            type: [Schema.Types.Mixed],
            required: false,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Project =
  (models.Project as mongoose.Model<ProjectType>) ||
  mongoose.model<ProjectType>("Project", ProjectSchema);

export default Project;
