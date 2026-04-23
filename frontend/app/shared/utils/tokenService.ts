import { jwtDecode } from "jwt-decode";

// Function to retrieve the authentication token from localStorage
const getStoredAuthToken = (): string | null => {
  return localStorage.getItem("authToken") || localStorage.getItem("token");
};

// Function to retrieve the authentication token from localStorage
export const getAuthToken = (): string | null => {
  return getStoredAuthToken();
};

// Function to extract the user ID from the authentication token
export const getUserIdFromToken = (): number | null => {
  const token = getStoredAuthToken(); // Retrieve the token from localStorage
  if (!token) return null; // Return null if no token is found

  try {
    // Decode the token and extract the user ID
    const decoded: { id: number } = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    // Log the error for debugging purposes and return null
    console.error("Error decoding the token:", error);
    return null;
  }
};
