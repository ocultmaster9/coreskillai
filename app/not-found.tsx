export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-display font-extrabold text-brand-500 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/" className="btn-primary">
            Go Home
          </a>
          <a href="/tools" className="btn-secondary">
            Browse Tools
          </a>
        </div>
      </div>
    </div>
  );
}
