import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Fab, Paper, Typography } from "@mui/material";
import { Zoom } from "@mui/material";

function Note(props) {
  return (
    <Zoom in={true}>
      <Paper
        elevation={3}
        sx={{
          padding: "10px",
          backgroundColor: "#4A90E2",
          color: "#eaeaea",
          borderRadius: "7px",
          position: "relative",
          minHeight: "240px",
        }}
      >
        <Typography variant="h5" component="h1" sx={{ marginBottom: "6px" }}>
          {props.title}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{
            marginBottom: "10px",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {props.content}
        </Typography>
        <Fab
          color="default"
          size="small"
          sx={{ position: "absolute", right: 60, bottom: 10 }}
          onClick={() => props.onEdit(props.id)}
        >
          <EditIcon />
        </Fab>
        <Fab
          color="default"
          size="small"
          sx={{ position: "absolute", right: 10, bottom: 10 }}
          onClick={() => props.onclick(props.id)}
        >
          <DeleteIcon />
        </Fab>
      </Paper>
    </Zoom>
  );
}

export default Note;