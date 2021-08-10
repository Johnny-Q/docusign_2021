import { Link } from "react-router-dom";
import "./Navbar.css";
const Navbar = () => {
    return (
        <div className="navbar">
            <h1>Conservatr</h1>
            <div className="links">
                <Link to="/home">
                    Home
                </Link>
                <Link to="/about">
                    About
                </Link>
                <Link to="/sign_up">
                    Sign Up
                </Link>
                <Link to="/test">
                    Test
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
