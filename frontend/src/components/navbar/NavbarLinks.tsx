import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, logOut } from "../../auth";
import { NavbarSearch } from "./NavbarSearch";

const LIBRARY_PATH = "/games/lib/trending";
const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";

type NavbarLinksProps = {
  children?: ReactNode;
};

export function NavbarLinks({ children }: NavbarLinksProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === LOGIN_PATH;
  const isRegisterPage = location.pathname === REGISTER_PATH;

  function handleLogout() {
    logOut();
    navigate(LOGIN_PATH, {
      state: {
        loggedOut: true,
      },
    });
  }

  return (
    <div className="navbar-actions">
      {children}

      {isLoggedIn() ? (
        <>
          <button
            type="button"
            className="navbar-text-button"
            onClick={handleLogout}
          >
            Log out
          </button>

          <Link to={LIBRARY_PATH} className="navbar-link">
            Games
          </Link>

          <NavbarSearch />
        </>
      ) : (
        <>
          {!isLoginPage && (
            <Link to={LOGIN_PATH} className="navbar-link">
              Log in
            </Link>
          )}

          {!isRegisterPage && (
            <Link to={REGISTER_PATH} className="navbar-link navbar-link-primary">
              Register
            </Link>
          )}

          <Link to={LIBRARY_PATH} className="navbar-link">
            Games
          </Link>

          <NavbarSearch />
        </>
      )}
    </div>
  );
}
