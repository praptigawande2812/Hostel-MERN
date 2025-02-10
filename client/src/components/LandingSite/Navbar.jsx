import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-10 text-white md:px-20">
      <Link to="/" className="flex z-10 md:py-3 font-bold text-xl lg:text-4xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 lg:w-10 lg:h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          />
        </svg>
        &nbsp; HMS
      </Link>
      <div className="flex gap-10 md:flex">
        <Link
          to="/auth/request"
          className="md:py-3 md:hover:text-blue-500 font-bold transition-all ease-linear"
        >
          Request
        </Link>
        <Link
          to="/auth/admin-login"
          className="md:py-3 md:hover:text-blue-500 font-bold transition-all ease-linear"
        >
          Admin Login
        </Link>
        <Link
          to="/auth/login"
          className="md:bg-blue-500 md:hover:bg-blue-700 transition md:text-white font-bold md:text-lg md:py-3 md:mb-3 md:px-8 md:rounded"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export { Navbar };
