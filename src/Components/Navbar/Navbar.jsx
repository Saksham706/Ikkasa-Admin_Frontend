import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/Ikkasa_Logo_1.webp';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('Orders');

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleSelect = (option) => {
    setSelectedOrder(option);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo-section">
        <img src={logo} alt="Ikkasa Logo" className="navbar-logo-img" />
        <div className="navbar-logo-text">Ikkasa Admin</div>
      </div>

      <div className="navbar-menu">
        <div className="navbar-item" onClick={toggleDropdown}>
          {selectedOrder} ▾
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => handleSelect('Forward')}>Forward</div>
              <div className="dropdown-item" onClick={() => handleSelect('Return')}>Return</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
