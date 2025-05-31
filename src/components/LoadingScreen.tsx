import React from 'react';
import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 flex flex-col items-center justify-center z-50 p-4"
      initial={{ opacity: 0, scale: 0.95 }} // Start slightly smaller and transparent
      animate={{ opacity: 1, scale: 1 }}    // Zoom in and become fully opaque
      exit={{ opacity: 0, scale: 1.05 }}    // Zoom out slightly while fading
      transition={{ duration: 0.5, ease: "easeOut" }} // Add ease for smoother effect
    >
      <motion.div
        className="text-white text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="mb-6"
        >
          <Hourglass size={80} className="mx-auto text-white" />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Unveiling Your Lifesand...
        </h1>
        <p className="text-lg sm:text-xl font-light max-w-md mx-auto">
          Calculating the moments that truly matter.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
