import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiShieldCheck, HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import './Navbar.css';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/predict', label: 'Predict' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <HiShieldCheck />
          </div>
          <span className="navbar-title">ClaimGuard<span className="navbar-title-accent">AI</span></span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'navbar-links--open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${location.pathname === link.path ? 'navbar-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              {location.pathname === link.path && <span className="navbar-link-indicator" />}
            </Link>
          ))}
          <Link
            to="/predict"
            className="navbar-cta"
            onClick={() => setMobileOpen(false)}
          >
            Analyze Claim
          </Link>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
