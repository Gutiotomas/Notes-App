import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import "../styles/welcome.css";

// WelcomePage component: Displays a welcome message and navigation options for login or registration
const WelcomePage: React.FC = () => {
  return (
    <div className="welcome-container">
      {/* Main content container */}
      <div className="welcome-content">
        {/* Welcome message */}
        <h1>Welcome to the Notes Application</h1>
        <p>Please log in or create an account to access your notes.</p>
        {/* Buttons for navigation */}
        <div className="welcome-buttons">
          {/* Link to the login page */}
          <Link to="/login">
            <Button
              text="Sign In"
              onClick={() => {}} // Placeholder for button click handler
              className="welcome-button"
            />
          </Link>
          {/* Link to the registration page */}
          <Link to="/register">
            <Button
              text="Sign Up"
              onClick={() => {}} // Placeholder for button click handler
              className="welcome-button"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
