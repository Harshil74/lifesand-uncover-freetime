import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { WastedActivity } from '../types';
import { formatNumber, getRandomId } from '../utils/helpers';
import { DEFAULT_WASTED_ACTIVITIES, DAYS_IN_YEAR, HOURS_IN_DAY } from '../utils/constants';

interface TimeDebtCalculatorProps {
  age: number;
  lifeExpectancy: number;
}

const TimeDebtCalculator: React.FC<TimeDebtCalculatorProps> = ({
  age,
  lifeExpectancy,
}) => {
  const [wastedActivities, setWastedActivities] = useState<WastedActivity[]>(DEFAULT_WASTED_ACTIVITIES);
  const [debtClockSeconds, setDebtClockSeconds] = useState<number>(0);

  const totalWastedHoursPerDay = wastedActivities.reduce((sum, activity) => 
    sum + activity.dailyHours
  , 0);

  const yearsLeft = Math.max(0, lifeExpectancy - age);
  const totalWastedHoursOverLife = totalWastedHoursPerDay * DAYS_IN_YEAR * yearsLeft;
  const wastedTimeYears = totalWastedHoursOverLife / (HOURS_IN_DAY * DAYS_IN_YEAR);

  useEffect(() => {
    const wastedSecondsSoFar = wastedTimeYears * 365 * 24 * 60 * 60;
    
    setDebtClockSeconds(wastedSecondsSoFar);

    const interval = setInterval(() => {
      setDebtClockSeconds(prevSeconds => prevSeconds + (totalWastedHoursPerDay / 24 / 60 / 60)); 
    }, 1000);

    return () => clearInterval(interval);
  }, [wastedTimeYears, totalWastedHoursPerDay, age, lifeExpectancy]);

  const handleUpdateWastedActivity = (id: string, dailyHours: number) => {
    setWastedActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === id ? { ...activity, dailyHours: Math.max(0, dailyHours) } : activity
      )
    );
  };

  const handleUpdateWastedActivityName = (id: string, name: string) => {
    setWastedActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === id ? { ...activity, name } : activity
      )
    );
  };

  const handleAddWastedActivity = () => {
    setWastedActivities(prevActivities => [
      ...prevActivities,
      {
        id: getRandomId(),
        name: 'New Time Sink',
        icon: 'Hourglass',
        dailyHours: 1,
        color: '#9ca3af', // gray-400
      },
    ]);
  };

  const handleDeleteWastedActivity = (id: string) => {
    setWastedActivities(prevActivities => prevActivities.filter(activity => activity.id !== id));
  };

  const formatTime = (totalSeconds: number) => {
    const years = Math.floor(totalSeconds / (365 * 24 * 3600));
    totalSeconds %= (365 * 24 * 3600);
    const days = Math.floor(totalSeconds / (24 * 3600));
    totalSeconds %= (24 * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  const getSarcasticInsight = (wastedYears: number, activities: WastedActivity[]) => {
    const sortedActivities = [...activities].sort((a, b) => b.dailyHours - a.dailyHours);
    const topSinks = sortedActivities.slice(0, 2).map(a => a.name.toLowerCase());

    let activityPhrase = '';
    if (topSinks.length === 1) {
      activityPhrase = `perfected your ${topSinks[0]} skills`;
    } else if (topSinks.length > 1) {
      activityPhrase = `mastered ${topSinks[0]} and ${topSinks[1]}`;
    }

    if (wastedYears === 0) {
      return "Wow, you're a productivity guru! Or maybe you just haven't discovered TikTok yet?";
    } else if (wastedYears < 0.5) {
      return "That's barely a blip! Keep up the 'good' work... or don't.";
    } else if (wastedYears < 2) {
      return `You've wasted about ${formatNumber(wastedYears)} years. That's like binge-watching every TV show ever made, twice.`;
    } else if (wastedYears < 5) {
      return `A solid ${formatNumber(wastedYears)} years down the drain. You could have learned 10 new languages, or just ${activityPhrase || 'perfected your couch potato skills'}.`;
    } else if (wastedYears < 10) {
      return `Over ${formatNumber(wastedYears)} years gone! You're practically a professional time-waster. Congrats? You could have ${activityPhrase ? `become an expert in ${topSinks.join(' and ')}` : 'achieved anything!'}.`;
    } else {
      return `An astonishing ${formatNumber(wastedYears)} years of your life, vanished! You've achieved peak procrastination. What a legacy! Perhaps you've set a new world record in ${activityPhrase || 'doing absolutely nothing'}.`;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <LucideIcons.Clock size={24} className="mr-2 text-gray-700" />
        The Time Debt Calculator
      </h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Ever wonder where all your time goes? This section highlights activities you've marked as "time sinks"
        and calculates the total time "debt" accumulated over your remaining life.
      </p>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Identified Time Sinks:</h3>
        {wastedActivities.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {wastedActivities.map(activity => {
              const Icon = LucideIcons[activity.icon as keyof typeof LucideIcons] || LucideIcons.Hourglass;
              return (
                <motion.div 
                  key={activity.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 p-4 rounded-lg mb-3 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  {/* Icon and Activity Name Input */}
                  <div className="flex items-center flex-grow min-w-0 w-full sm:w-auto mb-3 sm:mb-0 sm:mr-4">
                    <Icon size={20} className={`mr-3 flex-shrink-0`} style={{ color: activity.color }} />
                    <input
                      type="text"
                      value={activity.name}
                      onChange={(e) => handleUpdateWastedActivityName(activity.id, e.target.value)}
                      className="font-medium text-gray-800 bg-white border border-gray-200 rounded-md px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none flex-grow min-w-0 shadow-sm"
                      aria-label={`Edit activity name: ${activity.name}`}
                    />
                  </div>
                  
                  {/* Range Input, Hours Display, and Delete Button (now inline) */}
                  <div className="flex items-center flex-grow min-w-0 w-full sm:w-auto">
                    <input
                      type="range"
                      min="0"
                      max="10" // Changed max to 10 hours
                      step="0.5"
                      value={activity.dailyHours}
                      onChange={(e) => handleUpdateWastedActivity(activity.id, parseFloat(e.target.value))}
                      className="flex-grow h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-500 mr-3"
                    />
                    <span className="text-gray-600 text-sm font-semibold min-w-[5rem] text-right whitespace-nowrap mr-3 sm:mr-0">
                      {activity.dailyHours} hrs/day
                    </span>
                    <button
                      onClick={() => handleDeleteWastedActivity(activity.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0 p-1 rounded-full hover:bg-gray-100"
                      aria-label={`Delete ${activity.name}`}
                    >
                      <LucideIcons.X size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-lg">
            No time sinks added yet. Click "Add Another Time Sink" to start tracking your time!
          </p>
        )}
        <motion.button
          onClick={handleAddWastedActivity}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-primary-100 text-primary-700 font-semibold hover:bg-primary-200 transition-colors duration-300 shadow-sm mt-4 text-base"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LucideIcons.Plus size={18} className="mr-2" />
          Add Another Time Sink
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current Debt Card */}
        <motion.div
          className="bg-red-50 rounded-xl shadow-lg p-6 sm:p-8 text-center flex flex-col justify-between border border-red-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-center">
            <LucideIcons.Hourglass size={24} className="mr-2 text-red-600" />
            Current Debt
          </h3>
          <motion.p 
            className="text-3xl sm:text-4xl font-extrabold text-red-700 mb-2 break-words"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            {formatTime(debtClockSeconds)}
          </motion.p>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">
            (This clock is ticking away your life as we speak!)
          </p>
        </motion.div>

        {/* Harsh Truth Card */}
        <motion.div
          className="bg-blue-50 rounded-xl shadow-lg p-6 sm:p-8 text-center flex flex-col justify-between border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-center">
            <LucideIcons.Lightbulb size={24} className="mr-2 text-blue-600" />
            The Harsh Truth
          </h3>
          <motion.p 
            className="text-gray-700 italic text-base sm:text-lg break-words"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            "{getSarcasticInsight(wastedTimeYears, wastedActivities)}"
          </motion.p>
          <p className="text-gray-600 mt-3 text-xs sm:text-sm">
            (A little dose of reality, served with a smile.)
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimeDebtCalculator;
