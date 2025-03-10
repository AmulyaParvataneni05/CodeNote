import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLoginContext } from "../../context/userLoginContext";
import logo from "./CODENOTE-removed-white.png";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import "./Header.css";

function Header() {
  const { userLoginStatus, logoutUser } = useContext(userLoginContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logo} alt="CODENOTE" />
      </Link>
      
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        {!userLoginStatus ? (
          <>
            <Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className="login-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;

{/*import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLoginContext } from '../../context/userLoginContext';
import logo from './CODENOTE-removed-white.png'
import { MdCreate } from "react-icons/md";
import { PiSignInLight } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import './Header.css';

function Header() {
  const { userLoginStatus, logoutUser, currentUser } = useContext(userLoginContext);
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate('/');
  }

  return (
    <div className='d-flex justify-content-between align-items-center header'>
      <div className='d-flex gap-4'>
        <Link to="/" className="text-decoration-none">
        <img src={logo} alt="CODENote" />
        </Link>
        <h1 className='fs-1'>CodeNote</h1>
      </div>
      <ul className='nav mb-0'>
        {!userLoginStatus ? (
          <>
            <li>
              <Link to='/register' className='nav-link'>SignUp</Link>
            </li>
            <li>
              <Link to='/login' className='nav-link'>SignIn</Link>
            </li>
          </>
        ) : (
          <li className='fs-5 nav-item'>
            <button className='nav-link' onClick={handleLogout}>
              <FiLogOut /> Sign Out {/*({currentUser?.username})
            </button>
          </li>
        )}
      </ul>
</div>
);
}

export default Header;*/}