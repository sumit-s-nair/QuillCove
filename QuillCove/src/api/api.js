import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Note API
export const addNote = async (noteData) => {
  try {
    const response = await axios.post(`${API_URL}/notes/add`, noteData);
    return response.data;
  } catch (error) {
    console.error("Error adding note:", error);
    throw new Error(error.response?.data?.message || "Failed to add note");
  }
};

export const getNotes = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/notes/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch notes");
  }
};

export const editNote = async (noteId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/notes/edit/${noteId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing note:", error);
    throw new Error(error.response?.data?.message || "Failed to edit note");
  }
};

export const deleteNote = async (noteData) => {
  try {
    const response = await axios.delete(`${API_URL}/notes/delete`, {
      data: noteData,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error(error.response?.data?.message || "Failed to delete note");
  }
};

// User API
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/register`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
