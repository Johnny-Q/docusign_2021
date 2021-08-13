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
        {/* <Link to="/about">About</Link> */}
        <Link to="/login">Log In</Link>
        {/* <Link to="/test">Test</Link> */}
      </div>
    </div>
  );
};

const Navbar = () => {
  const isLoggedIn = useRecoilValue(loggedInState);

  return (
    <div className="navbar">
      <h1
        onClick={() => window.location.assign("/")}
        style={{ color: "#137547" }}
      >
        AuditPal
      </h1>
      <div className="links">
        <Link
          to="/"
          style={{
            color: "#137547",
            textDecoration: "none",
            fontSize: "1.5em",
            marginLeft: "10px"
          }}
        >
          Home
        </Link>
        {/* <Link
          to="/about"
          style={{
            color: "#137547",
            textDecoration: "none",
            fontSize: "1.5em",
            marginLeft: "10px"
          }}
        >
          About
        </Link> */}
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              style={{
                color: "#137547",
                textDecoration: "none",
                fontSize: "1.5em",
                marginLeft: "10px"
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/logout"
              style={{
                color: "#137547",
                textDecoration: "none",
                fontSize: "1.5em",
                marginLeft: "10px"
              }}
            >
              Log Out
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: "#137547",
                textDecoration: "none",
                fontSize: "1.5em",
                marginLeft: "10px"
              }}
            >
              Log In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
