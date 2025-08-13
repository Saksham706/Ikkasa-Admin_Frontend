import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/Ikkasa_Logo_1.webp';

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
            <li>Forward orders</li>
            <li>Return orders</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
