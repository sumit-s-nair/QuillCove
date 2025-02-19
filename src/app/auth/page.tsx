"use client";

import { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import Background from "@/components/Background";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = auth.currentUser;
      if (user) {
        router.push("/");
      }
    };
    checkUser();
  }, [router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          notes: [],
          labels: [],
        });
      }

      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          setError("The popup was closed before completing the sign in. Please try again.");
        } else if (firebaseError.code === 'auth/cancelled-popup-request') {
          setError("The popup request was cancelled. Please try again.");
        } else if (firebaseError.code === 'auth/network-request-failed') {
          setError("Network error occurred. Please check your internet connection and try again.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <Background />
      <div className="bg-black/20 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6 w-32 h-32 mx-auto">
          <Image src={"/logo.png"} alt="QuillCove Logo" width={400} height={400} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login to QuillCove</h2>
        <p className="text-white mb-6 text-center">
          Welcome back! Please login to your account to continue.
        </p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
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
