"use client";

import { FaGoogle } from "react-icons/fa";
import Background from "@/components/Background";

export default function Login() {

  const handleGoogleSignIn = () => {
    // Functionality to be added later
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <Background />
      <div className="bg-black/20 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login to QuillCove</h2>
        <p className="text-white mb-6 text-center">
          Welcome back! Please login to your account to continue.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full p-2 mb-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          <FaGoogle size={20} className="mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
