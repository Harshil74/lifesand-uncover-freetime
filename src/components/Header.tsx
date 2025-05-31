import React from 'react';
import { motion } from 'framer-motion';
import { Clock, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="w-full mb-6 text-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Clock size={48} className="text-primary-500" />
          </motion.div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
            Time Left
          </span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Calculate how much free time you actually have left in your life, based on your daily routine, and embark on a journey of mindful living.
        </p>
        
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          <HelpCircle size={16} className="mr-2 text-primary-400" />
          <span>Adjust your age and daily activities to see your results</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Header;
