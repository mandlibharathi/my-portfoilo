import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="page-section">
          <div className="container">
            <p className="section-label">
              About Me
            </p>

            <h1>Who I Am</h1>

            <p>
              I'm a passionate developer who
              enjoys building modern web
              applications and solving real-world
              problems with technology.
            </p>

            <p>
              I focus on creating clean,
              responsive and accessible
              experiences using modern web
              technologies.
            </p>

            <p>
              My current stack includes Next.js,
              React, TypeScript, MongoDB, ReactNative
              Mongoose and Node.js.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}