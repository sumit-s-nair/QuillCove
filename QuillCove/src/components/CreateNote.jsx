import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab, TextField, Box, Stack } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateNote(props) {
  const [titleText, setTitleText] = useState("");
  const [contextText, setContextText] = useState("");

  useEffect(() => {
    if (props.title && props.content) {
      setTitleText(props.title);
      setContextText(props.content);
    } else {
      setTitleText("");
      setContextText("");
    }
  }, [props.title, props.content]);

  function Onchange(event) {
    const { name, value } = event.target;
    name === "title" ? setTitleText(value) : setContextText(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onclick(titleText, contextText);
    if (props.title === "" && props.content === "") {
      setTitleText("");
      setContextText("");
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        margin: "20px auto",
        padding: "15px",
        backgroundColor: "#fff",
        borderRadius: "7px",
        boxShadow: "0 1px 5px rgb(138, 137, 137)",
        width: "480px",
      }}
    >
      <Stack spacing={2}>
        <TextField
          name="title"
          label="Title"
          variant="outlined"
          value={titleText}
          onChange={Onchange}
          fullWidth
        />
        <TextField
          name="content"
          label="Take a note..."
          variant="outlined"
          value={contextText}
          onChange={Onchange}
          multiline
          rows={3}
          fullWidth
        />
        <Zoom in={true}>
          <Fab
            type="submit"
            color="primary"
            aria-label="add"
            sx={{ alignSelf: "flex-end" }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </Stack>
    </Box>
  );
}

export default CreateNote;
