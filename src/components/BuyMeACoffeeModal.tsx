import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, QrCode, Github, Twitter } from 'lucide-react'; // Import QrCode icon
import DynamicIcon from './DynamicIcon'; // Assuming you have a DynamicIcon component

interface BuyMeACoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyMeACoffeeModal: React.FC<BuyMeACoffeeModalProps> = ({ isOpen, onClose }) => {
  // No need for handleLinkClick if we're just showing a QR code
  // const handleLinkClick = (url: string) => {
  //   window.open(url, '_blank');
  //   onClose(); // Close modal after opening link
  // };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking outside
        >
          <motion.div
            className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl shadow-2xl p-8 w-full max-w-md text-white text-center overflow-hidden transform scale-95"
            initial={{ y: -50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-primary-100 hover:text-white transition-colors z-10"
              aria-label="Close donation modal"
            >
              <X size={28} strokeWidth={2.5} />
            </button>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
              className="mb-6 flex justify-center"
            >
              <QrCode size={64} className="text-primary-200 drop-shadow-lg" /> {/* Changed icon to QrCode */}
            </motion.div>

            <h2 className="text-3xl font-extrabold mb-3 leading-tight">
              Enjoying Lifesand?
            </h2>
            <p className="text-primary-100 mb-7 text-lg">
              Consider supporting its development with a small gesture!
            </p>

            <div className="space-y-4 mb-8">
              <motion.div
                className="w-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img
                  src="https://via.placeholder.com/200x200?text=Your+QR+Code+Here" // Placeholder QR code image
                  alt="Scan to support"
                  className="w-48 h-48 rounded-lg mb-4 border-4 border-primary-200 shadow-md"
                />
                <p className="text-primary-800 font-semibold text-lg">
                  Scan to support Lifesand!
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  (Replace this QR code with your actual payment QR)
                </p>
              </motion.div>
            </div>

            <div className="flex justify-center space-x-6 text-primary-200">
              <motion.a
                href="https://github.com/yourusername" // Replace with actual link
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Visit developer's GitHub"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={28} />
              </motion.a>
              <motion.a
                href="https://twitter.com/yourusername" // Replace with actual link
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Follow developer on Twitter"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={28} />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyMeACoffeeModal;
