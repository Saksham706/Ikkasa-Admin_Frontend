import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/Ikkasa_Logo_1.webp';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo-section">
        <img src={logo} alt="Ikkasa Logo" className="navbar-logo-img" />
        <div className="navbar-logo-text">Ikkasa Admin</div>
      </div>

      {/* Hamburger icon for mobile */}
      <div
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
        <div className="navbar-item">
          <ul>
            <li><Link className="navbar-link">Forward orders</Link></li>
            <li>
              <Link to='/main-dashboard' className="navbar-link">Return orders</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
