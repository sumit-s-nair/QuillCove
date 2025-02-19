"use client";

import { FaGoogle } from "react-icons/fa";
import Background from "@/components/Background";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
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
