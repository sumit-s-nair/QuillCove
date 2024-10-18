import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function Auth({ isSignup, onSubmit, setIsSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onSubmit(username, password);
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        color: "white",
        backgroundColor: '#1C1C1C',
        borderRadius: '8px',
        width: '300px',
        margin: '0 auto',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
        {isSignup ? "Sign Up" : "Login"}
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField 
          label="Username" 
          variant="outlined" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          sx={{ 
            marginBottom: '1rem', 
            width: '100%', 
            backgroundColor: 'white', 
            borderRadius: '4px',
            height: '56px',
          }} 
        />
        <TextField 
          label="Password" 
          type="password" 
          variant="outlined" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          sx={{ 
            marginBottom: '1rem', 
            width: '100%', 
            backgroundColor: 'white', 
            borderRadius: '4px',
            height: '56px',
          }} 
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ 
            width: '100%', 
            marginBottom: '1rem', 
            borderRadius: '4px', 
            height: '56px',
          }} 
        >
          {isSignup ? "Sign Up" : "Login"}
        </Button>
        <Button 
          onClick={() => setIsSignup(!isSignup)} 
          sx={{ 
            marginTop: '1rem', 
            color: 'white', 
            textDecoration: 'underline', 
            height: '56px',
          }} 
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </Button>
      </form>
    </Box>
  );
}

export default Auth;