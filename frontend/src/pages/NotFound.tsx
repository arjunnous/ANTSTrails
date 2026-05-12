import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="glass-card p-12 rounded-2xl text-center max-w-md">
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">Oops! Page not found.</p>
        <Link
          to="/"
          className="glass-button inline-block px-8 py-4 rounded-lg text-white font-semibold hover:bg-opacity-20 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}