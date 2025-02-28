import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Navbar Center */}
      <div className="navbar-center">
        <div
          className="center-text"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="./colologo-removebg-preview.png" // Replace with your logo file path
              alt="Colosseum Logo"
              className="navbar-logo"
            />
            <Link to="/" className="navbar-title">
              Colosseum 2025
            </Link>
            {/* <Link to="/" className="navbar-title" style={{ marginLeft: '10px', marginTop: '25px' }}>Colosseum 2025</Link> */}
          </div>
          {/* <div className="tiny" style={{ fontSize: '15px' }}>Presents</div> */}
        </div>
      </div>

      

    </nav>
  );
};

export default Navbar;
