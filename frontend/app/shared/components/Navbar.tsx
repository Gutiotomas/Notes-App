import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import "../styles/navbar.css";
import { Button } from "./Button";
import { getAuthToken } from "../utils/tokenService";

// Navbar component: Handles navigation and user session state
export const Navbar: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false); // State to manage the visibility of the navigation menu
  const location = useLocation(); // Hook to get the current route location
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // State to track if the user is logged in
  const [canScroll, setCanScroll] = useState<boolean>(false); // State to track if the page can scroll
  const [isScrolled, setIsScrolled] = useState<boolean>(false); // State to track if the user has started scrolling

  // Determine if the login button should be hidden based on the current route
  const hideLoginButton =
    location.pathname === "/login" || location.pathname === "/register";

  // Effect to check if the user is logged in by verifying the presence of an auth token in localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && getAuthToken()) {
      setIsLoggedIn(true);
    }
  }, []);

  // Show scroll controls only when the document is actually taller than the viewport
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateScrollState = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      setCanScroll(documentHeight > viewportHeight + 8);
    };

    updateScrollState();

    window.addEventListener("resize", updateScrollState);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("resize", updateScrollState);
      resizeObserver.disconnect();
    };
  }, []);

  // Track whether the page is currently scrolled to soften sticky navbar appearance
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to handle user logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken"); // Remove the auth token from localStorage
      localStorage.removeItem("token");
    }
    setIsLoggedIn(false); // Update the logged-in state
    navigate("/"); // Redirect to the home page
  };

  // Scroll smoothly to the top of the page
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll smoothly to the bottom of the page
  const scrollToBottom = () => {
    if (typeof window !== "undefined") {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      window.scrollTo({
        top: documentHeight - viewportHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`navbar-container ${isNavOpen ? "nav-open" : ""} ${
        isScrolled ? "is-scrolled" : ""
      }`}
    >
      <div className="navbar">
        {/* Hamburger menu button to toggle the navigation menu */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="burger-menu"
        >
          <RxHamburgerMenu size={25} />
        </button>

        {/* Navigation links */}
        <div className="navbar-links">
          {isLoggedIn ? (
            <Link to="/home">
              <Button
                text="Notes"
                onClick={() => setIsNavOpen(false)}
                className="nav-button"
              />
            </Link>
          ) : (
            <Link to="/">
              <Button
                text="Home"
                onClick={() => setIsNavOpen(false)}
                className="nav-button"
              />
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/archive">
              <Button
                text="Archived"
                onClick={() => setIsNavOpen(false)}
                className="login-button"
              />
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/notes">
              <Button
                text="Create"
                onClick={() => setIsNavOpen(false)}
                className="login-button"
              />
            </Link>
          )}
        </div>

        {/* Login/Logout button */}
        <div className="login">
          {!hideLoginButton &&
            (isLoggedIn ? (
              <Button
                text="Logout"
                onClick={handleLogout}
                className="logout-button"
              />
            ) : (
              <Link to="/login">
                <Button
                  text="Login"
                  onClick={() => setIsNavOpen(false)}
                  className="login-button"
                />
              </Link>
            ))}
        </div>
      </div>

      {/* Side navigation menu for smaller screens */}
      {isNavOpen && (
        <div className="side-nav">
          <button onClick={() => setIsNavOpen(false)} className="close-menu">
            &lt;
          </button>
          <ul>
            {isLoggedIn ? (
              <li>
                <Link to="/home" onClick={() => setIsNavOpen(false)}>
                  Notes
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/" onClick={() => setIsNavOpen(false)}>
                  Home
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/archive" onClick={() => setIsNavOpen(false)}>
                  Archived
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/notes" onClick={() => setIsNavOpen(false)}>
                  Create
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {canScroll && !isNavOpen && (
        <div className="scroll-controls">
          <button
            type="button"
            className="scroll-btn"
            onClick={scrollToTop}
            aria-label="Go to top"
            title="Go to top"
          >
            ↑
          </button>
          <button
            type="button"
            className="scroll-btn"
            onClick={scrollToBottom}
            aria-label="Go to bottom"
            title="Go to bottom"
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
};
