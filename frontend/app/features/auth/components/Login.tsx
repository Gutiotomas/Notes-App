import React, { useState } from "react";
import { Input } from "../../../shared/components/Input";
import { Button } from "../../../shared/components/Button";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import type { LoginData } from "../utils/types";
import "../styles/login.css";

// Login component for user authentication
export const Login: React.FC = () => {
  // State to manage form data
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  // State to manage form validation errors
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  // React Router's navigation hook
  const navigate = useNavigate();

  // Function to validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to handle login logic
  const handleLogin = async () => {
    const newErrors: Partial<LoginData> = {};

    // Validate email field
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (formData.email.length > 50) {
      newErrors.email = "Email must not exceed 50 characters";
    }

    // Validate password field
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (formData.password.length > 20) {
      newErrors.password = "Password must not exceed 20 characters";
    }

    // If there are validation errors, update the state and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Clear errors and proceed with login
      setErrors({});
      try {
        // Attempt to log in the user
        const token = await loginUser(formData.email, formData.password);
        if (token) {
          // Save the token in local storage and navigate to the home page
          localStorage.setItem("authToken", token);
          navigate("/home");
        } else {
          // Set error if credentials are invalid
          setErrors({
            email: "Invalid credentials, please check your email or password",
          });
        }
      } catch (error) {
        // Handle server errors
        console.error("Error during login:", error);
        setErrors({ email: "Error en el servidor" });
      }
    }
  };

  // Function to handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-container">
      {/* Page title */}
      <h1 className="auth-title">Login</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        {/* Email input field */}
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@example.com"
          required={true}
          maxLength={50}
        />
        {/* Display email validation error */}
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* Password input field */}
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter at least 8 characters"
          required={true}
          maxLength={20}
        />
        {/* Display password validation error */}
        {errors.password && <p className="error-text">{errors.password}</p>}

        {/* Login button */}
        <div className="button-container">
          <Button text="Login" type="submit" className="auth-button" />
        </div>
      </form>

      {/* Link to the registration page */}
      <p className="auth-link-container">
        Don't have an account yet? <br />
        <Link to="/register" className="auth-link">
          Sign up
        </Link>
      </p>
    </div>
  );
};
