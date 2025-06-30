import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">ToolWiseAI</Link>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 mb-1 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 mb-1 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
        {/* Navigation links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/reviews" className="text-gray-700 hover:text-blue-600 font-medium">Reviews</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link to={`/user/${user.userId || user._id || user.id}`} className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 font-medium focus:outline-none ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/reviews" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Reviews</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Contact</Link>
            {user ? (
              <>
                <Link to={`/user/${user.userId || user._id || user.id}`} className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-gray-700 hover:text-red-600 font-medium focus:outline-none text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header; 