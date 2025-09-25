import { Link } from 'react-router-dom';

const DashboardNotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-6xl font-bold text-slate-700">404</h1>
      <p className="mt-4 text-xl text-slate-600">
        Oops! The page you're looking for inside the dashboard doesn't exist.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        Go to Dashboard Home
      </Link>
    </div>
  );
};

export default DashboardNotFoundPage;
