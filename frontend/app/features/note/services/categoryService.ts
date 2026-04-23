// Base API URL for the backend server
const API_URL = import.meta.env.VITE_API_URL;
const getStoredAuthToken = () =>
  localStorage.getItem("authToken") || localStorage.getItem("token");

// Fetch all categories
export const getCategories = async () => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Create a new category
export const createCategory = async (name: string) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (categoryId: number, name: string) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (categoryId: number) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Fetch categories not associated with a specific note
export const getCategoriesNotInNote = async (noteId: number) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      `${API_URL}/categories/note/${noteId}/not-in`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories not in note: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories not in note:", error);
    return [];
  }
};

// Fetch categories associated with a specific note
export const getCategoriesByNote = async (noteId: number) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/categories/note/${noteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories by note: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories by note:", error);
    return [];
  }
};
