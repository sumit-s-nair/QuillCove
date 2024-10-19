import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

function Auth({ isSignup, onSubmit, onSignup, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Clear any previous error messages
    setErrorMessage("");

    try {
      await onSubmit(email, password);
    } catch (error) {
      // Handle error from login or signup with more specific messages
      if (error.response) {
        // Check if the error response has a specific message
        switch (error.response.status) {
          case 401:
            // Unauthorized - perhaps incorrect password or not registered
            setErrorMessage("Incorrect email or password. Please try again.");
            break;
          case 404:
            // Not Found - email not registered
            setErrorMessage(
              "It looks like you aren't registered. Please sign up."
            );
            break;
          case 400:
            // Bad Request - validation issues
            setErrorMessage(
              error.response.data.message || "Please check your input."
            );
            break;
          default:
            setErrorMessage("An error occurred. Please try again later.");
        }
      } else {
        // Fallback for network errors or other issues
        setErrorMessage(
          "Network error. Please check your connection and try again."
        );
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        color: "white",
        backgroundColor: "#1C1C1C",
        borderRadius: "8px",
        width: "300px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        {isSignup ? "Sign Up" : "Login"}
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: "1rem", width: "100%" }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            marginBottom: "1rem",
            width: "100%",
            backgroundColor: "#1C1C1C",
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#1C1C1C",
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
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            marginBottom: "1rem",
            width: "100%",
            backgroundColor: "#1C1C1C",
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#1C1C1C",
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "100%", marginBottom: "1rem" }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </Button>
        <Button
          onClick={isSignup ? onLogin : onSignup}
          sx={{
            marginTop: "1rem",
            color: "white",
            textDecoration: "underline",
          }}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </Button>
      </form>
    </Box>
  );
}

export default Auth;
