import React from 'react';
import './navbar.css'; // or wherever you handle header styling

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/'; // redirect to login/home
  };

  return (
    <div className="navbar">
      <h2>💸 FinVista</h2>

      <div className="user-menu">
        <span className="user-icon">👤</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
