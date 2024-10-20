
# QuillCove

**QuillCove** is a modern notes application that allows users to create, manage, and store notes securely. It features a clean user interface with fast performance, thanks to the integration of a MERN stack backend and React-based frontend.

[Live App](https://quillcove.onrender.com/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [License](#license)

## Features

- **User Authentication**: Secure login and registration for users.
- **Note Management**: Add, edit, and delete personal notes.
- **Responsive Design**: Works on mobile and desktop devices.
- **API Integration**: Interacts with a backend API for data storage and management.
- **Dark Mode**: Eye-friendly dark mode for note-taking.

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Styling**: Material-UI
- **Deployment**: Render.com

## Setup and Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Render](https://render.com/)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/sumit-s-nair/QuillCove.git
   cd QuillCove
   \`\`\`

2. Install dependencies for both frontend and backend:
   \`\`\`bash
   # Install dependencies for frontend
   cd QuillCove
   npm install

   # Install dependencies for backend
   cd ../Backend
   npm install
   \`\`\`

3. Create a `.env` file in the root of the `/Backend` directory and add your environment variables (check the section below for required variables).

4. Run the application locally:
   \`\`\`bash
   # Start the backend
   npm run start --prefix Backend

   # Start the frontend
   npm run dev --prefix QuillCove
   \`\`\`

### Environment Variables

Create a `.env` file in the `Backend/` directory and include the following:

\`\`\`
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
\`\`\`

In your frontend `.env` file (`QuillCove/`), add:

\`\`\`
VITE_API_URL=https://quillcove.onrender.com/api
\`\`\`

### Running the Application

Once everything is set up, open your browser and navigate to:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Deployment

QuillCove is deployed on Render. Here’s a simplified structure of the `render.yaml` used for deployment:

\`\`\`yaml
services:
  - type: web
    name: quill-cove-backend
    env: node
    buildCommand: npm install --prefix Backend
    startCommand: npm run start --prefix Backend
    plan: free
    envVars:
      MONGODB_URI: your_mongodb_connection_string
      JWT_SECRET: your_jwt_secret_key

  - type: web
    name: quill-cove-frontend
    env: static
    buildCommand: npm install --prefix QuillCove && npm run build --prefix QuillCove
    startCommand: serve -s QuillCove/dist
    plan: free
    envVars:
      VITE_API_URL: https://quillcove.onrender.com/api
\`\`\`

## License

This project is licensed under the MIT License.
