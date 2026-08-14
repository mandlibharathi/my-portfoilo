import Navbar from "../components/Navbar";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="page-section">
          <div className="container">
            <p className="section-label">
              Contact
            </p>

            {/* CONTACT DETAILS */}
            <div className="contact-details">
              <div>
                <span>📞 Phone: </span>
                <a href="tel:+919XXXXXXXXX">
                  +91 6305630682
                </a>
              </div>

              <div>
                <span>✉️ Email: </span>
                <a href="mailto:yourname@example.com">
mandlibharathi@gmail.com               
 </a>
              </div>
            </div>

            <h1>Let's Work Together</h1>

            <p>
              Have a project, opportunity or
              question? Send me a message.
            </p>

            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}