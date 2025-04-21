import React, { useState } from "react";
import { Input } from "../../../shared/components/Input";
import { Button } from "../../../shared/components/Button";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import type { RegisterData } from "../utils/types";
import "../styles/register.css";

// Register component for user registration
export const Register: React.FC = () => {
  // State to manage form data
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });

  // State to manage form validation errors
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  // Hook to navigate between routes
  const navigate = useNavigate();

  // Function to validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to validate name format
  const validateName = (name: string) => {
    const re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return (
      typeof name === "string" &&
      re.test(name.trim()) &&
      name.trim().length >= 2
    );
  };

  // Function to handle user registration
  const handleRegister = async () => {
    const newErrors: Partial<RegisterData> = {};

    // Validate name
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (!validateName(formData.name)) {
      newErrors.name = "Invalid name";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }

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

    // If there are validation errors, set them in the state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        // Attempt to register the user
        const token = await registerUser(
          formData.name,
          formData.email,
          formData.password
        );

        // If registration is successful, store the token and navigate to the home page
        if (token) {
          localStorage.setItem("authToken", token);
          navigate("/home");
        } else {
          // Handle case where email is already in use
          setErrors({ email: "This email is already in use" });
        }
      } catch (error) {
        console.error("Error during registration:", error);
        // Handle server error
        setErrors({ email: "Server error" });
      }
    }
  };

  // Function to handle input changes and update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-container">
      {/* Registration form title */}
      <h1 className="auth-title">Register</h1>

      {/* Input for name */}
      <Input
        label="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required={true}
        maxLength={50}
      />
      {errors.name && <p className="error-text">{errors.name}</p>}

      {/* Input for email */}
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
      {errors.email && <p className="error-text">{errors.email}</p>}

      {/* Input for password */}
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
      {errors.password && <p className="error-text">{errors.password}</p>}

      {/* Button to submit the registration form */}
      <div className="button-container">
        <Button
          text="Register"
          onClick={handleRegister}
          className="auth-button"
        />
      </div>

      {/* Link to navigate to the login page */}
      <p className="auth-link-container">
        Already have an account? <br />
        <Link to="/login" className="auth-link">
          Log in
        </Link>
      </p>
    </div>
  );
};
