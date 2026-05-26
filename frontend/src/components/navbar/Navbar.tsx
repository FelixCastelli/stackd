import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { NavbarLinks } from "./NavbarLinks";
import "./Navbar.css";

type NavbarProps = {
  children?: ReactNode;
  overlay?: boolean;
};

export function Navbar({ children, overlay = false }: NavbarProps) {
  return (
    <nav className={`navbar ${overlay ? "navbar-overlay" : ""}`}>
      <div className="navbar-container">
        <Link to="/games/lib/trending" className="navbar-brand">
          Backloggr
        </Link>

        <NavbarLinks>{children}</NavbarLinks>
      </div>
    </nav>
  );
}
