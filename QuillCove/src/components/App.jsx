import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateNote from "./CreateNote";
import Auth from "./Auth";
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

function App() {
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editNoteIndex, setEditNoteIndex] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  class NoteItem {
    constructor(title, content) {
      this.title = title;
      this.content = content;
    }
  }

  const createCard = (item, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Note
        title={item.title}
        content={item.content}
        id={index}
        onclick={deleteNote}
        onEdit={() => openEditNoteDialog(item.title, item.content, index)}
      />
    </Grid>
  );

  function addItem(titleText, contextText) {
    const note = new NoteItem(titleText, contextText);
    if (editNoteIndex !== null) {
      setNotes((prevItems) =>
        prevItems.map((item, index) => (index === editNoteIndex ? note : item))
      );
    } else {
      setNotes((prevItems) => [...prevItems, note]);
    }
    handleCloseModal();
  }
  

  const deleteNote = (id) => {
    setNotes((prevItems) => prevItems.filter((_, index) => index !== id));
  };

  const handleAuthSubmit = (username, password) => {
    setIsLoggedIn(true);
    setIsSignup(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditNoteIndex(null);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditNoteDialog = (title, content, index) => {
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
              sx={{
                position: "fixed",
                bottom: 90,
                right: 16,
                zIndex: 1000,
              }}
              onClick={handleOpenModal}
            >
              <AddIcon />
            </Fab>
            <Dialog
              open={openModal}
              onClose={handleCloseModal}
              sx={{
                "& .MuiDialog-container": {
                  backdropFilter: "blur(5px)",
                },
                "& .MuiPaper-root": {
                  backgroundColor: "#2A2A2A",
                  color: "white",
                },
              }}
            >
              <DialogTitle>
                {editNoteIndex !== null ? "Edit Note" : "Add a Note"}
              </DialogTitle>
              <DialogContent>
                <CreateNote
                  onclick={addItem}
                  title={noteTitle}
                  content={noteContent}
                  setTitle={setNoteTitle}
                  setContent={setNoteContent}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={addItem}
                  color="primary"
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Auth
            isSignup={isSignup}
            onSubmit={handleAuthSubmit}
            setIsSignup={setIsSignup}
          />
        )}
      </Container>
      <Footer />
    </Box>
  );
}

export default App;