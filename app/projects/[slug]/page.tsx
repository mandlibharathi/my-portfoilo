import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import { getProjects } from "@/app/lib/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const projects = await getProjects();

  const project = projects.find(
    (item) => item.slug === slug
  );

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main>
        <section className="page-section">
          <div className="container">
            <Link
              href="/projects"
              className="back-link"
            >
              ← Back to Projects
            </Link>

            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="project-details-image"
              />
            )}

            {project.featured && (
              <span className="project-badge">
                Featured
              </span>
            )}

            <p className="section-label">
              Project
            </p>

            <h1>{project.title}</h1>

            <p className="project-description">
              {project.description}
            </p>

            <div className="project-technologies">
              {project.technologies.map(
                (technology) => (
                  <span
                    key={technology}
                    className="technology"
                  >
                    {technology}
                  </span>
                )
              )}
            </div>

            <div className="project-actions">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-primary"
                >
                  GitHub
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}