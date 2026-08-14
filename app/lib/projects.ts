import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import { connectDB } from "@/app/lib/mongodb";


/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

export interface IProject {
  title: string;
  slug: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    image: {
      type: String,
      default: "",
    },

    technologies: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      default: "",
    },

    liveUrl: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>(
    "Project",
    ProjectSchema
  );

/* -------------------------------------------------------------------------- */
/* Contact message                                                             */
/* -------------------------------------------------------------------------- */

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema =
  new Schema<IContactMessage>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 200,
      },

      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
      },

      read: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>(
    "ContactMessage",
    ContactMessageSchema
  );

/* -------------------------------------------------------------------------- */
/* Portfolio projects                                                         */
/* -------------------------------------------------------------------------- */

export const fallbackProjects: IProject[] = [
  {
    title: "Portfolio Website",
    slug: "portfolio-website",

    description:
      "A modern full-stack portfolio built with Next.js, TypeScript, Mongoose and MongoDB.",

    image: "/projects/portfolio.jpg",

    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "MongoDB",
      "Mongoose",
    ],

    githubUrl:
      "https://github.com/mandlibharathi/portfolio",

    liveUrl: "",

    featured: true,

    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    title: "Project Two",
    slug: "project-two",

    description:
      "A responsive web application demonstrating modern frontend and backend development.",

    image: "/projects/project-two.jpg",

    technologies: [
      "Next.js",
      "TypeScript",
      "MongoDB",
    ],

    githubUrl:
      "https://github.com/mandlibharathi/project-two",

    liveUrl: "",

    featured: false,

    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    title: "Project Three",
    slug: "project-three",

    description:
      "A practical application focused on performance, accessibility and clean user experience.",

    image: "/projects/project-three.jpg",

    technologies: [
      "React",
      "Node.js",
      "MongoDB",
    ],

    githubUrl:
      "https://github.com/mandlibharathi/project-three",

    liveUrl: "",

    featured: false,

    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getProjects() {
  try {
    await connectDB();

    const projects = await Project.find({})
      .sort({
        featured: -1,
        createdAt: -1,
      })
      .lean();

    if (projects.length > 0) {
      return projects.map((project) => ({
        ...project,
        _id: project._id.toString(),
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      }));
    }

    return fallbackProjects.map((project) => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error(
      "Unable to load projects from MongoDB:",
      error
    );

    return fallbackProjects.map((project) => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));
  }
}