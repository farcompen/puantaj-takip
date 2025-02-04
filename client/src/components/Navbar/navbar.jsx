import React from 'react';
import { FaPowerOff } from 'react-icons/fa';
import { logout } from '../login/logout';
const Navbar = () => {

  return (
    <nav className="navbar ">
        
     
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <h6 className="navbar-title">Puantaj Takip Sistemi </h6>
        <a className="btn" onClick={() => logout()}><FaPowerOff /></a>
      </div>
     
    </nav>
  );
};

export default Navbar;