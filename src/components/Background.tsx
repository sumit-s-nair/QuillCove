"use client";

import { motion } from "framer-motion";

const Background = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Primary dynamic blobs */}
      <motion.div
        className="absolute top-[10%] left-[5%] h-[800px] w-[800px] rounded-full bg-gradient-to-br from-green-400 to-teal-500 blur-[150px] opacity-50"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
          scale: [1, 0.8, 0.6, 1],
          opacity: [0.5, 0.6, 0.4, 0.5],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[5%] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-[140px] opacity-45"
        animate={{
          x: [0, -120, 120, 0],
          y: [0, 120, -120, 0],
          scale: [1, 1.2, 0.8, 1],
          opacity: [0.45, 0.55, 0.35, 0.45],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Secondary blobs */}
      <motion.div
        className="absolute top-[30%] left-[30%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 blur-[160px] opacity-30"
        animate={{
          x: [0, -80, 80, -80, 80, 0],
          y: [0, 80, -80, 80, -80, 0],
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.3, 0.4, 0.2, 0.3],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[20%] right-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 blur-[120px] opacity-25"
        animate={{
          x: [0, 60, -60, 60, -60, 0],
          y: [0, -60, 60, -60, 60, 0],
          rotate: [0, 10, -10, 10, -10, 0],
          scale: [1, 1.05, 0.95, 1],
          opacity: [0.25, 0.35, 0.15, 0.25],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[20%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-red-500 to-pink-400 blur-[110px] opacity-20"
        animate={{
          x: [0, 40, -40, 40, -40, 0],
          y: [0, -40, 40, -40, 40, 0],
          scale: [1, 1.08, 0.92, 1],
          opacity: [0.2, 0.3, 0.1, 0.2],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Background;
