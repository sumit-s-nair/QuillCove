import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import HighlightIcon from "@mui/icons-material/Highlight";

function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#4A90E2",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar>
        <HighlightIcon sx={{ marginRight: "10px", color: "#fff" }} />
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "700", color: "#fff" }}
        >
          Quill Cove
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
