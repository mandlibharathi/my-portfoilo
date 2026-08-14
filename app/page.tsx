import Navbar from "./components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="hero">
          <div className="container">
            <p className="hero-label">
              Full-Stack Developer
            </p>

            <h1>
              Hi, I'm
              <br />
              Bharathi ...
            </h1>

            <p className="hero-description">
              I build modern, scalable and
              user-friendly web applications
              using Next.js, TypeScript and
              MongoDB.
            </p>

            <div className="hero-actions">
              <a
                href="/rbac/dashboard"
                className="button button-primary"
              >
                View Projects
              </a>

              <a
                href="/contact"
                className="button"
              >
                Contact Me
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}