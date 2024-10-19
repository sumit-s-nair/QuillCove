import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1C1C1C",
        height: "7vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ccc",
        boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography variant="body2" color="inherit">
        Copyright © {year}
      </Typography>
    </Box>
  );
}

export default Footer;
