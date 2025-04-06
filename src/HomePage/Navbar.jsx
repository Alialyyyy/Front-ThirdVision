import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eye2 from '../assets/eye2.png';
import './Navbar.css';

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [button, setButton] = useState(true);

  const closeMobileMenu = () => setIsMobile(false);

  const showButton = () => {
    setButton(window.innerWidth > 960);
  };

  useEffect(() => {
    showButton();
    window.addEventListener('resize', showButton);
    
    return () => {
      window.removeEventListener('resize', showButton);
    };
  }, []);

  return (
    <nav className="navbar">
        <div className="navbar-container">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img src={eye2} className="img"/> ThirdVision <i className="fab fa-typo3" />
            </Link>
            <div className="menu-icon" onClick={() => setIsMobile(!isMobile)}>
                <i className={isMobile ? 'fa fa-times' : 'fa fa-bars'} />
            </div>
            <ul className={isMobile ? 'nav-menu active' : 'nav-menu'}>
                <li className="nav-item">
                    <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/About" className="nav-links" onClick={closeMobileMenu}>
                        About
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/Founders" className="nav-links" onClick={closeMobileMenu}>
                        Founders
                    </Link>
                </li>
            </ul>
        </div>
    </nav>
);
};


export default Navbar;
