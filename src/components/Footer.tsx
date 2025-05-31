import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FooterProps {
  onOpenBuyMeACoffee: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenBuyMeACoffee }) => {
  return (
    <motion.footer
      className="bg-gray-800 text-gray-300 py-6 mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-2">
          Made with <Heart size={16} className="inline-block text-red-400 mx-1" fill="currentColor" /> by a passionate developer.
        </p>
        <p className="text-xs mb-4">
          &copy; {new Date().getFullYear()} Lifesand. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          {/* <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onOpenBuyMeACoffee(); }}
            className="text-primary-300 hover:text-primary-100 transition-colors duration-200 font-semibold"
          >
            Buy Me A Coffee
          </a> */}
          <a 
            href="https://github.com/Harshil74" // Replace with actual GitHub repo link
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-300 hover:text-primary-100 transition-colors duration-200 font-semibold"
          >
            GitHub
          </a>
          <a 
            href="https://www.linkedin.com/in/harshilgohel/" // Replace with actual Twitter link
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-300 hover:text-primary-100 transition-colors duration-200 font-semibold"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
