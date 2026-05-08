import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Page not found</h1>
        <Link className="primary-button wide" to="/">
          Go Home
        </Link>
      </section>
    </main>
  );
}
