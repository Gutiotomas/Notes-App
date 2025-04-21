// Define the base API URL for authentication-related requests
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Logs in a user by sending their email and password to the server.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the authentication token if successful, or null if an error occurs.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    // Send a POST request to the login endpoint with the user's credentials
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify({ email, password }), // Send the email and password in the request body
    });

    // Check if the response status is not OK (e.g., 4xx or 5xx)
    if (!response.ok) {
      const data = await response.json(); // Parse the error response
      throw new Error(data.error || "Authentication error"); // Throw an error with the server's message or a default message
    }

    const data = await response.json(); // Parse the successful response
    if (!data.token) {
      throw new Error("Token not found in the server response"); // Ensure the token exists in the response
    }
    return data.token; // Return the authentication token
  } catch (error) {
    console.error("Authentication error:", error); // Log the error for debugging
    return null; // Return null to indicate failure
  }
};

/**
 * Registers a new user by sending their name, email, and password to the server.
 * @param name - The user's name.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the authentication token if successful, or null if an error occurs.
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<string | null> => {
  try {
    // Send a POST request to the register endpoint with the user's details
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify({ name, email, password }), // Send the name, email, and password in the request body
    });

    // Check if the response status is not OK (e.g., 4xx or 5xx)
    if (!response.ok) {
      const data = await response.json(); // Parse the error response
      throw new Error(data.error || "Registration error"); // Throw an error with the server's message or a default message
    }

    const data = await response.json(); // Parse the successful response
    if (!data.token) {
      throw new Error("Token not found in the server response"); // Ensure the token exists in the response
    }
    return data.token; // Return the authentication token
  } catch (error) {
    console.error("Registration error:", error); // Log the error for debugging
    return null; // Return null to indicate failure
  }
};
