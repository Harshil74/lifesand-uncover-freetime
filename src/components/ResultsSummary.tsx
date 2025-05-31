import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { TimeLeftCalculation } from '../types';
import { formatNumber } from '../utils/helpers';
import { SHARE_TEMPLATES } from '../utils/constants';
import ShareModal from './ShareModal';
import DynamicIcon from './DynamicIcon';

interface ResultsSummaryProps {
  calculation: TimeLeftCalculation;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ calculation }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const suggestedCaption = `Just found out I have ${formatNumber(calculation.freeTimeYears)} years of free time left! 🤯 Time to make every moment count. #TimeWise #LifeGoals`;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const freeTimeActivity = calculation.activitiesBreakdown.find(a => a.name === 'Free Time');
  const nonFreeTimeActivities = calculation.activitiesBreakdown.filter(a => a.name !== 'Free Time');

  // Filter out Miscellaneous if its value is less than 1
  const filteredLifeBreakdownComparisons = calculation.lifeBreakdownComparisons.filter(
    (comparison) => !(comparison.name === 'Miscellaneous' && comparison.value < 1)
  );

  const getComparisonDisplayName = (name: string) => {
    if (name === 'Free Time (Remaining Life)') {
      return 'Your True Free Time';
    }
    return name.replace(/years on |years/gi, '').trim();
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg mb-8 overflow-hidden relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background subtle gradient/texture for classic feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50 rounded-xl"></div>
      <div className="relative z-10">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900 mb-4 text-center leading-tight"
          variants={itemVariants}
        >
          You Don't Have a Life, You Have Free Time.
        </motion.h2>

        <motion.p
          className="text-lg text-gray-700 mb-6 text-center max-w-2xl mx-auto"
          variants={itemVariants}
        >
          It's a stark truth: much of our existence is spent on obligations. What truly remains is a precious, finite amount of free time. This is your real life.
        </motion.p>

        <motion.div
          className="text-center mb-8 p-4 bg-primary-50 bg-opacity-70 rounded-lg border border-primary-100 shadow-inner"
          variants={itemVariants}
        >
          <p className="text-xl font-medium text-gray-800 mb-2">You have approximately</p>
          <motion.div
            className="text-7xl font-extrabold text-primary-700 leading-none drop-shadow-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            {formatNumber(calculation.freeTimeYears)} years
          </motion.div>
          <p className="text-2xl font-semibold text-gray-800 mt-3">of free time remaining!</p>
          <p className="text-sm text-gray-600 mt-2">
            That's about <span className="font-semibold">{formatNumber(calculation.freeTimeDays)} days</span> or{' '}
            <span className="font-semibold">{formatNumber(calculation.freeTimePercentage)}%</span> of your remaining life.
          </p>
          <p className="text-xs text-gray-500 mt-4 italic">
            Note: This is your remaining free time, based on your current age and life expectancy.
          </p>
        </motion.div>

        <hr className="border-gray-200 my-8" />

        <motion.h3
          className="text-2xl font-bold text-gray-800 mb-5 text-center"
          variants={itemVariants}
        >
          Where does your time really go?
        </motion.h3>
        {/* <motion.p
          className="text-2xl font-bold text-gray-800 mb-5 text-center"
          variants={itemVariants}
        >
          Your Life, Broken Down by Years
        </motion.p> */}
        <motion.p
          className="text-lg text-gray-700 mb-6 text-center max-w-2xl mx-auto"
          variants={itemVariants}
        >
          A closer look at how your *entire* life's years are spent reveals the true value of your free time.
        </motion.p>
        <p className="text-sm text-gray-500 mb-6 text-center italic">
          Note: These figures for activities represent the years you will spend on each activity during your entire life, based on your defined daily activities. This is an assumption, not actual numbers.
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          variants={containerVariants}
        >
          {filteredLifeBreakdownComparisons.map((comparison, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg shadow-sm flex items-center space-x-3 border hover:shadow-md transition-shadow duration-200 ${comparison.name === 'Free Time (Remaining Life)'
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-gray-50 border-gray-100'
                }`}
              variants={itemVariants}
            >
              <DynamicIcon
                name={comparison.icon}
                size={40}
                className={`${comparison.name === 'Free Time (Remaining Life)'
                    ? 'text-emerald-500'
                    : 'text-gray-500' // Changed to gray for black and white effect
                  } flex-shrink-0`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xl font-semibold text-gray-800 break-words">{formatNumber(comparison.value)} years</p>
                <p className="text-sm text-gray-600 break-words">{getComparisonDisplayName(comparison.name)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-lg text-gray-700 mb-6 text-center max-w-2xl mx-auto font-semibold"
          variants={itemVariants}
        >
          This comparison highlights the stark reality: your true freedom is a precious, limited resource. Make every moment count!
        </motion.p>

        <motion.div
          className="text-center mt-8"
          variants={itemVariants}
        >
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Share Your Lifesand Insight!
          </button>
        </motion.div>

        {/* <motion.p
          className="text-xs text-gray-400 mt-8 text-center italic"
          variants={itemVariants}
        >
          Disclaimer: This is not financial advice. Or life advice. Or advice. Go touch grass. 🌱
        </motion.p> */}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        calculation={calculation}
        templates={SHARE_TEMPLATES}
        caption={suggestedCaption}
      />
    </motion.div>
  );
};

export default ResultsSummary;
