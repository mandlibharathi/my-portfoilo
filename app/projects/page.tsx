import Navbar from "@/app/components/Navbar";
import ProjectCard from "@/app/components/ProjectCard";
import { getProjects } from "@/app/lib/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />

      <main>
        <section className="page-section">
          <div className="container">

            <div className="section-header">
              <p className="section-label">
                My Work
              </p>

              <h1>Projects</h1>

              <p>
                A selection of applications and
                systems I have designed and built.
              </p>
            </div>

            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                />
              ))}
            </div>

          </div>
        </section>
      </main>
    </>
  );
}