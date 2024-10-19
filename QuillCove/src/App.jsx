import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateNote from "./components/CreateNote";
import Auth from "./components/Auth";
import {
  Box,
  Grid,
  Container,
  Fab,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  getNotes,
  addNote,
  deleteNote as deleteNoteAPI,
  editNote,
  registerUser,
  loginUser,
} from "./api/api";

function App() {
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editNoteIndex, setEditNoteIndex] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotes();
    }
  }, [isLoggedIn]);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const data = await getNotes(userId);
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a new note
  const handleAddNote = async () => {
    try {
      const newNote = { userId, title: noteTitle, content: noteContent };
      const data = await addNote(newNote);
      setNotes(data.notes);

      // Reseting the state after adding a note
      resetNoteFields();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Edit an existing note
  const handleEditNote = async () => {
    try {
      const noteToEdit = notes[editNoteIndex];
      const updatedNoteData = {
        userId,
        title: noteTitle,
        content: noteContent,
      };

      const updatedNote = await editNote(noteToEdit._id, updatedNoteData);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteToEdit._id ? updatedNote.note : note
        )
      );

      resetNoteFields();
      handleCloseModal();
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    try {
      const noteData = { userId, noteId: id };
      const response = await deleteNoteAPI(noteData);
      setNotes(response.notes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const createCard = (item) => (
    <Grid item xs={12} sm={6} md={4} key={item._id}>
      <Note
        title={item.title}
        content={item.content}
        id={item._id} // Use item._id
        onclick={() => handleDeleteNote(item._id)}
        onEdit={() => openEditNoteDialog(item.title, item.content, item._id)}
      />
    </Grid>
  );

  const handleAuthSubmit = async (username, password) => {
    try {
      const response = isSignup
        ? await registerUser(username, password)
        : await loginUser(username, password);

      if (response.userId) {
        setIsLoggedIn(true);
        setIsSignup(false);
        localStorage.setItem("userId", response.userId); // Storing userId
        fetchNotes(); // Fetching notes after login/signup
      } else {
        setAuthError(response.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setAuthError(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetNoteFields();
  };

  const resetNoteFields = () => {
    setEditNoteIndex(null);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditNoteDialog = (title, content, id) => {
    const index = notes.findIndex((note) => note._id === id);
    setEditNoteIndex(index);
    setNoteTitle(title);
    setNoteContent(content);
    setOpenModal(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#1C1C1C",
      }}
    >
      <Header />
      <Container sx={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
        {isLoggedIn ? (
          <>
            <TextField
              variant="outlined"
              placeholder="Search Notes..."
              onChange={handleSearchChange}
              sx={{
                marginBottom: "2rem",
                width: "100%",
                backgroundColor: "#1C1C1C",
                color: "white",
                "& input": {
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4A90E2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4A90E2",
                  },
                },
              }}
            />
            <Grid container spacing={3} className="notes-container">
              {filteredNotes.map(createCard)}
            </Grid>
            <Fab
              color="primary"
              aria-label="add"
              onClick={handleOpenModal}
              sx={{
                position: "fixed",
                bottom: "5.5rem",
                right: "2rem",
              }}
            >
              <AddIcon />
            </Fab>
            <Dialog
              open={openModal}
              onClose={handleCloseModal}
              sx={{
                "& .MuiDialog-paper": {
                  backgroundColor: "#333",
                  color: "white",
                },
              }}
            >
              <DialogTitle sx={{ color: "white" }}>
                {editNoteIndex !== null ? "Edit Note" : "New Note"}
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Title"
                  fullWidth
                  variant="outlined"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#4A90E2",
                      },
                      "&:hover fieldset": {
                        borderColor: "#4A90E2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4A90E2",
                      },
                    },
                  }}
                />
                <TextField
                  margin="dense"
                  label="Content"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#4A90E2",
                      },
                      "&:hover fieldset": {
                        borderColor: "#4A90E2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4A90E2",
                      },
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={
                    editNoteIndex !== null
                      ? () =>
                          handleEditNote(editNoteIndex, noteTitle, noteContent)
                      : () => handleAddNote(noteTitle, noteContent)
                  }
                  color="primary"
                >
                  {editNoteIndex !== null ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Auth
            onSubmit={handleAuthSubmit}
            isSignup={isSignup}
            onSignup={() => setIsSignup(true)}
            onLogin={() => setIsSignup(false)}
          />
        )}
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
