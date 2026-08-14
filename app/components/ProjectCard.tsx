import Link from "next/link";

type ProjectCardProps = {
  project: {
    title: string;
    slug: string;
    description: string;
    image: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    featured: boolean;
  };
};

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <article className="project-card">

      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="project-image"
        />
      )}

      <div className="project-content">

        {project.featured && (
          <span className="project-badge">
            Featured
          </span>
        )}

        <h2>{project.title}</h2>

        <p>{project.description}</p>

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

          <Link
            href={`/projects/${project.slug}`}
            className="button button-primary"
          >
            View Project
          </Link>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
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
    </article>
  );
}