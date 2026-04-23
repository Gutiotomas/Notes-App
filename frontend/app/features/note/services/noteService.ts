// Base API URL for the backend server
const API_URL = import.meta.env.VITE_API_URL;
const getStoredAuthToken = () =>
  localStorage.getItem("authToken") || localStorage.getItem("token");

// Add a category to a note
export const addCategoryToNote = async (noteId: number, categoryId: number) => {
  const response = await fetch(`${API_URL}/notes/categories/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getStoredAuthToken()}`,
    },
    body: JSON.stringify({ noteId, categoryId }),
  });
  return response.json();
};

// Remove a category from a note
export const removeCategoryFromNote = async (
  noteId: number,
  categoryId: number,
) => {
  const response = await fetch(`${API_URL}/notes/categories/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getStoredAuthToken()}`,
    },
    body: JSON.stringify({ noteId, categoryId }),
  });
  return response.json();
};

// Fetch notes by category
export const getNotesByCategory = async (categoryId: number) => {
  try {
    const response = await fetch(`${API_URL}/notes/categories/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStoredAuthToken()}`,
      },
    });

    if (response.status === 404) {
      console.warn("Category not found.");
      return [];
    }

    if (!response.ok) {
      console.error(
        `Failed to fetch notes by category: ${response.statusText}`,
      );
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("Invalid response format for notes by category:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching notes by category:", error);
    return [];
  }
};

// Create a new note
export const createNote = async (
  title: string,
  content: string,
  categories: number[] = [],
  value: number = 0,
) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, categories, value }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (
  noteId: number,
  title: string,
  content: string,
  categories: number[],
  value: number,
) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, categories, value }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

// Fetch all notes
export const getAllNotes = async () => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/notes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all notes:", error);
    throw error;
  }
};

// Archive a note
export const archiveNote = async (noteId: number) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/notes/${noteId}/archive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to archive note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error archiving note:", error);
    throw error;
  }
};

// Unarchive a note
export const unarchiveNote = async (noteId: number) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/notes/${noteId}/archive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to unarchive note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error unarchiving note:", error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId: number) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

// Fetch a note by its ID
export const getNoteById = async (noteId: number) => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching note by ID:", error);
    throw error;
  }
};

// Fetch all archived notes
export const getArchivedNotes = async () => {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/notes/archive`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch archived notes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching archived notes:", error);
    throw error;
  }
};
