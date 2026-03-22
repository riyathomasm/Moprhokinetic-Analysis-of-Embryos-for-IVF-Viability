import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Embryo<span>Vision</span>
        </Link>
        <nav className="nav">
          <Link to="/analyse">
            <button className={`nav-btn ${location.pathname === "/analyse" ? "active" : ""}`}>
              Static Analysis
            </button>
          </Link>
          <Link to="/morph">
            <button className={`nav-btn ${location.pathname === "/morph" ? "active" : ""}`}>
              Morphokinetic Audit
            </button>
          </Link>
          <Link to="/about">
            <button className={`nav-btn ${location.pathname === "/about" ? "active" : ""}`}>
              About
            </button>
          </Link>
          <button className="nav-btn outline">Login</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;