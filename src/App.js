import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmailSender from "./MernStack.js";
import Domain from "./Ecell.js";
import CSI from "./CSI.js";
import Debate from "./Debate.js";
import Madgear from "./Madgear.js";
import Home from "./Home.js";
import IEEE from "./IEEE.js";
import Navbar from "./Navbar.js";
import AliTalk from "./AliTalk.js";
import UtkarshTalk from "./UtkarshTalk.js";
import SuryaTalk from "./SuryaTalk.js";
import VineetTalk from "./VineetTalk.js";
import MayankTalk from "./MayankTalk.js";
import PiyushTalk from "./Standup.js";
// import ColoNite from "./ColoNite.js";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const correctUsername = "ColoAdminLenoy";
  const correctPassword = "LenoyChitre";

  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert("Incorrect username or password");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url("/space_bg4.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!authenticated ? (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ display: "block", margin: "10px auto", padding: "5px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", margin: "10px auto", padding: "5px" }}
          />
          <button onClick={handleLogin} style={{ padding: "5px 10px" }}>
            Login
          </button>
        </div>
      ) : (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aaaaaaaabcdGDSCaaaaabsc" element={<EmailSender />} />
            <Route path="/asdasdsaDomainsdffggf" element={<Domain />} />
            <Route path="/asdasdesdDebateasdaedasdd" element={<Debate />} />
            <Route path="/asdadeaadsMadgearadadedasdads" element={<Madgear />} />
            <Route path="/asdadaeasdCSIasdasdedaasd" element={<CSI />} />
            <Route path="/nvjgjggidbIEEEmfgndjf" element={<IEEE />} />
            <Route path="/asasdasdasAliasasdasa" element={<AliTalk />} />
            <Route path="/lklkooiMayankmkj" element={<MayankTalk />} />
            <Route path="/ihhshUtkarshkjiji" element={<UtkarshTalk/>} />
            <Route path="/ffsdfsdwSuryaasdasdas" element={<SuryaTalk />} />
            <Route path="/asdwVineetsd" element={<VineetTalk />} />
            <Route path="/asdeasdaPiyushwesdasd" element={<PiyushTalk />} />
            {/* <Route path="/asadasaColoNiteasawad" element={<ColoNite />} /> */}
          </Routes>
        </Router>
      )}
    </div>
  );
};

export default App;
