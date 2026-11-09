import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">404 - Endpoint or Page Not Found</h2>
      <p className="text-slate-400 text-sm mb-6 max-w-md">
        The requested resource was not found. Visit the API documentation or use the /books endpoints.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
