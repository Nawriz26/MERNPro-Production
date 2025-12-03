// NotFound.jsx
// Simple 404 page shown when no route matches.

export default function NotFound() {
  return (
    <div className="container py-4 page-transition">
      <h2>404 - Page Not Found</h2>
      <p className="text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
    </div>
  );
}
