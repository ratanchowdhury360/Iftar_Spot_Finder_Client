import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router';
import { AuthContext } from '../Context/AuthProvider';

const Navber = () => {
  const location = useLocation();
  const { user, loading, logOut } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/create', label: 'Create Iftar Spot' },
    { path: '/archive', label: 'Archived Iftar' },
    { path: '/map', label: 'Map View' },
  ];

  const Navlinks = (
    <>
      {navLinks.map(({ path, label }) => (
        <li key={path}>
          <Link
            to={path}
            className={isActive(path) ? 'active font-medium' : ''}
          >
            {label}
          </Link>
        </li>
      ))}
    </>
  );

  const handleLogout = () => {
    logOut();
  };

  return (
    <div className="sticky top-0 z-50 bg-base-100/95 backdrop-blur border-b border-base-200 shadow-sm">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-100 mt-3 w-52 p-2 shadow-lg border border-base-200"
            >
              {Navlinks}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl gap-2 text-primary">
            <span aria-hidden>🌙</span>
            <span className="hidden sm:inline">Iftar Spot Finder</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-0.5">{Navlinks}</ul>
        </div>
        <div className="navbar-end gap-2">
          {loading ? (
            <span className="btn btn-ghost btn-sm loading loading-spinner" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm gap-2"
              >
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {user.email?.charAt(0).toUpperCase() || '?'}
                </span>
                <span className="hidden sm:inline max-w-30 truncate">
                  {user.email}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-100 mt-2 w-56 p-2 shadow-lg border border-base-200"
              >
                <li className="menu-title text-sm text-base-content/70">
                  {user.email}
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm rounded-xl">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navber;
