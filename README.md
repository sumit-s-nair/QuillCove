# QuillCove

(Its a notes app pretty self explainatory but if you really wanna know do read ahead espically if you dont know how to set up a next app now we go to a more formal explaination).

**QuillCove** is a modern notes application that allows users to create, manage, and store notes securely. It features a clean user interface with fast performance, thanks to the integration of Next.js and Firebase.

[Live App](https://quill-cove.vercel.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Deployment](#deployment)
- [License](#license)

## Features

- **User Authentication**: Secure login and registration for users using Firebase Authentication.
- **Note Management**: Add, edit, and delete personal notes stored in Firebase Firestore.
- **Responsive Design**: Works on mobile and desktop devices.
- **Dark Mode**: Eye-friendly dark mode for note-taking.
- **Search Functionality**: Quickly find notes using the search bar.
- **Label Management**: Organize notes with custom labels.
- **Starred Notes**: Mark important notes as starred for quick access.
- **Spotlight View**: View notes in a spotlight modal for better readability.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Firebase Functions
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Setup and Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Firebase CLI](https://firebase.google.com/docs/cli) or set it up in the firebase console and copy the keys
- [Vercel CLI](https://vercel.com/docs/cli) set this up in the vercel website dont waste time on this

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sumit-s-nair/QuillCove.git
   cd QuillCove

   ```

2. Install dependencies for both frontend and backend:
   ```bash

   # Install dependencies

   npm install

3. Set up Firebase:
   ```bash
   firebase login
   firebase init

4. Create a `.env` file in the root directory and add your environment variables (VERY IMPORTANT as im not sharing my keys with you, did you honestly think im that kind, anyways check the example.env for required variables).

5. Run the application locally:
   ```bash
   # Start the app
   npm run dev

### Running the Application

Once everything is set up, open your browser and navigate to:

- Frontend: `http://localhost:3000`

## Deployment

QuillCove is deployed on Vercel. Here’s a simplified structure of the vercel.json used for deployment (idk why your doing it this way but if you are heres the config, just use the vercel website for deployment bro they do it automatically for you): 

```json
{
  "builds": [
    {
      "src": "next.config.js",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "your_firebase_api_key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "your_firebase_auth_domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "your_firebase_project_id",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "your_firebase_storage_bucket",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "your_firebase_messaging_sender_id",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "your_firebase_app_id"
  }
}
```

## License

This project is licensed under the MIT License.
