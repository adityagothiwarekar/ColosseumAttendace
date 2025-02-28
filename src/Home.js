import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import the stylesheet

const Home = () => {
  return (
    <div className="home-container">
      <h2 className="home-title">Welcome to Registration desk Of Colosseum 2025</h2>

      {/* Workshop Divisions */}
      <div className="workshop-grid">
        <Link to="/aaaaaaaabcdGDSCaaaaabsc" className="workshop-button">
          MERN Stack Workshop
        </Link>
        <Link to="/asdasdsaDomainsdffggf" className="workshop-button">
          Entreprenuership Cell Workshop
        </Link>
        <Link to="/asdasdesdDebateasdaedasdd" className="workshop-button">
          Debate Workshop
        </Link>
        <Link to="/asdadeaadsMadgearadadedasdads" className="workshop-button">
          Madgear Workshop
        </Link>
        <Link to="/asdadaeasdCSIasdasdedaasd" className="workshop-button">
          CSI Workshop
        </Link>
        <Link to="/nvjgjggidbIEEEmfgndjf" className="workshop-button">
          IEEE Workshop
        </Link>
        <Link to="/asasdasdasAliasasdasa" className="workshop-button">
          Ali Talk
        </Link>
        <Link to="/ihhshUtkarshkjiji" className="workshop-button">
          Utkarsh Talk
        </Link>
        <Link to="/lklkooiMayankmkj" className="workshop-button">
          Mayank Talk
        </Link>
        <Link to="/asdwVineetsd" className="workshop-button">
          Vineet Talk
        </Link>
        <Link to="/ffsdfsdwSuryaasdasdas" className="workshop-button">
          Surya Talk
        </Link>
        <Link to="/asdeasdaPiyushwesdasd" className="workshop-button">
          Piyush Talk
        </Link>
      </div>
    </div>
  );
};

export default Home;
