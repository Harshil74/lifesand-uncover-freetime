import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { generateLifeInWeeks } from '../utils/calculations';
import { TimeLeftCalculation, WeekData } from '../types';

interface LifeInWeeksVisualizationProps {
  age: number;
  lifeExpectancy: number;
  calculation: TimeLeftCalculation;
}

// Helper component for animating numbers
const AnimatedNumber: React.FC<{ value: number; trigger: boolean }> = ({ value, trigger }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (trigger) {
      const animation = animate(count, value, { 
        duration: 0.8, // Fast and smooth animation
        ease: "easeOut" 
      });
      return animation.stop;
    } else {
      // Reset count to 0 when not in view, so it animates from 0 on next trigger
      count.set(0);
    }
  }, [value, trigger]);

  return <motion.span>{rounded}</motion.span>;
};

const LifeInWeeksVisualization: React.FC<LifeInWeeksVisualizationProps> = ({
  age,
  lifeExpectancy,
  calculation,
}) => {
  const allWeeks = generateLifeInWeeks(age, lifeExpectancy, calculation.activitiesBreakdown);

  const totalWeeksInLife = lifeExpectancy * 52;
  const weeksPassed = age * 52;
  
  // Calculate weeks allocated for daily activities (excluding 'Free Time')
  const weeksAllocatedForActivities = calculation.activitiesBreakdown
    .filter(a => a.name !== 'Free Time')
    .reduce((sum, a) => sum + Math.round(a.yearsSpent * 52), 0);

  // Actual free or unallocated weeks
  const actualFreeWeeks = Math.round(calculation.freeTimeYears * 52);

  // Prepare legend data, removing 'Unallocated' as it's now merged with 'Free Time'
  const legendData = [
    { name: 'Past Weeks', color: '#d1d5db', type: 'past' }, // gray-300
    { name: 'Free Time', color: '#10b981', type: 'free' }, // emerald-500
    ...calculation.activitiesBreakdown
      .filter(a => a.name !== 'Free Time' && a.yearsSpent > 0)
      .map(a => ({ name: a.name, color: a.color, type: 'activity' })),
  ].filter((item, index, self) => 
    index === self.findIndex(t => t.name === item.name) // Filter out duplicates
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.005, // Small stagger for a ripple effect
        delayChildren: 0.2,
      },
    },
  };

  const weekDotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const ref = useRef(null);
  // Adjusted amount to 0.1 to make it easier to trigger on mobile (10% of component in view)
  const isInView = useInView(ref, { once: true, amount: 0.1 }); 

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-primary-500 mb-4 flex items-center">
        <LucideIcons.CalendarDays size={24} className="mr-2 text-primary-600" />
        Your Life in Weeks
      </h2>
      <p className="text-gray-600 mb-6">
        Visualize your entire expected lifespan, week by week. Past weeks are greyed out,
        and remaining weeks are color-coded by how your time is spent.
      </p>

      {/* Week Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Total Weeks in Life */}
        <motion.div 
          className="bg-blue-50 rounded-lg p-4 text-center shadow-sm flex flex-col items-center justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <LucideIcons.Clock size={36} className="text-blue-600 mb-2" />
          <p className="text-gray-600 text-sm">Total Weeks in Life</p>
          <p className="text-3xl font-bold text-blue-800">
            <AnimatedNumber value={totalWeeksInLife} trigger={isInView} />
          </p>
          <p className="text-xs text-gray-500 mt-2">Every week is a gift. Unwrap it wisely.</p>
        </motion.div>

        {/* Card 2: Weeks Passed */}
        <motion.div 
          className="bg-gray-50 rounded-lg p-4 text-center shadow-sm flex flex-col items-center justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <LucideIcons.Heart size={36} className="text-gray-600 mb-2" />
          <p className="text-gray-600 text-sm">Weeks Already Passed</p>
          <p className="text-3xl font-bold text-gray-800">
            <AnimatedNumber value={weeksPassed} trigger={isInView} />
          </p>
          <p className="text-xs text-gray-500 mt-2">Nothing you can do about it. Don't live the past.</p>
        </motion.div>

        {/* Card 3: Weeks Allocated for Daily Activities */}
        <motion.div 
          className="bg-purple-50 rounded-lg p-4 text-center shadow-sm flex flex-col items-center justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LucideIcons.Activity size={36} className="text-purple-600 mb-2" />
          <p className="text-gray-600 text-sm">Weeks for Daily Activities</p>
          <p className="text-3xl font-bold text-purple-800">
            <AnimatedNumber value={weeksAllocatedForActivities} trigger={isInView} />
          </p>
          <p className="text-xs text-gray-500 mt-2">Every moment counts, even the routine ones. Make them meaningful!</p>
        </motion.div>

        {/* Card 4: Actual Free or Unallocated Weeks */}
        <motion.div 
          className="bg-teal-50 rounded-lg p-4 text-center shadow-sm flex flex-col items-center justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LucideIcons.Sparkles size={36} className="text-teal-600 mb-2" />
          <p className="text-gray-600 text-sm">Actual Free Weeks</p>
          <p className="text-3xl font-bold text-teal-800">
            <AnimatedNumber value={actualFreeWeeks} trigger={isInView} />
          </p>
          <p className="text-xs text-gray-500 mt-2">Your canvas of freedom. Paint it with purpose, joy, and unforgettable moments.</p>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-1 justify-center mb-6 max-h-[400px] overflow-y-auto p-3 border border-primary-100 bg-primary-50 rounded-lg shadow-inner">
        <motion.div
          className="flex flex-wrap gap-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allWeeks.map((week) => (
            <motion.span
              key={week.id}
              className={`rounded-full cursor-pointer relative group ${
                week.type === 'free' ? 'w-4 h-4' : 'w-3 h-3' // Removed border for free weeks
              }`}
              style={{ 
                backgroundColor: week.color,
                opacity: week.type === 'free' ? 1 : 0.4 // Reduced opacity for non-free weeks
              }}
              variants={weekDotVariants}
              whileHover={week.type === 'free' 
                ? { scale: 1.5, boxShadow: '0px 0px 12px rgba(16, 185, 129, 0.6)', opacity: 1 } // More pronounced scale and glow
                : { scale: 1.2, opacity: 0.7 }} // Slightly increase opacity on hover for non-free
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-md">
                {week.tooltip}
              </span>
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-100 shadow-sm">
        <h3 className="text-lg font-semibold text-primary-700 mb-3">Legend:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {legendData.map((item, index) => (
            <div key={index} className="flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-2 shadow-sm flex-shrink-0" // Added flex-shrink-0
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-gray-700 text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LifeInWeeksVisualization;
