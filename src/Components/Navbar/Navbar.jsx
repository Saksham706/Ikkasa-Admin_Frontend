import React from 'react';
import './Navbar.css';
import logo from '../../assets/Ikkasa_Logo_1.webp';

const Navbar = () => {
 

  return (
    <nav className="navbar">
      <div className="navbar-logo-section">
        <img src={logo} alt="Ikkasa Logo" className="navbar-logo-img" />
        <div className="navbar-logo-text">Ikkasa Admin</div>
      </div>

      <div className="navbar-menu">
        <div className="navbar-item" >
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
