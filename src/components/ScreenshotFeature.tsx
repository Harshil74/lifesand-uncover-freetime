import React from 'react';
import { motion } from 'framer-motion';

interface ScreenshotFeatureProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean; // To alternate image/content side
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ScreenshotFeature: React.FC<ScreenshotFeatureProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-feature-card p-8 border border-gray-100 transform hover:scale-102 hover:-translate-y-1 transition-all duration-300 ${
        reverse ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div className="md:w-1/2 text-center md:text-left ml-8 mr-8 mb-8 md:mb-0 md:pr-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
      <div className="md:w-1/2 relative rounded-xl overflow-hidden shadow-lg border border-gray-200 group flex items-center justify-center p-4"> {/* Added p-4 for internal padding */}
        {/* Stylish blend overlay - always visible, more pronounced on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300 z-10"></div>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto max-h-[400px] object-contain transform group-hover:scale-105 transition-transform duration-300 z-20" // Adjusted height and object-fit
        />
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white bg-black/50 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
          {imageAlt}
        </p>
      </div>
    </motion.div>
  );
};

export default ScreenshotFeature;
