import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loggedInState } from "../store";
import "./Navbar.css";

export const DefaultNavbar = () => {
  return (
    <div className="navbar">
      <h1>AuditPal</h1>
      <div className="links">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Log In</Link>
        <Link to="/test">Test</Link>
      </div>
    </div>
  );
};

const Navbar = () => {
  const isLoggedIn = useRecoilValue(loggedInState);

  return (
    <div className="navbar">
      <h1 onClick={() => window.location.assign("/")}>AuditPal</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/logout">Log Out</Link>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
          </>
        )}
        <Link to="/test">Test</Link>
      </div>
    </div>
  );
};

export default Navbar;
