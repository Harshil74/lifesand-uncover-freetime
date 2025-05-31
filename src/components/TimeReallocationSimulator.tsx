import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TimeLeftCalculation } from '../types';
import { calculateTimeLeft } from '../utils/calculations';
import { formatNumber } from '../utils/helpers';
import { MinusCircle, PlusCircle, Briefcase, PartyPopper } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { SARCASTIC_TIME_COMMENTS } from '../utils/constants';

interface TimeReallocationSimulatorProps {
  age: number;
  lifeExpectancy: number;
  originalActivities: Activity[];
  originalCalculation: TimeLeftCalculation;
}

const TimeReallocationSimulator: React.FC<TimeReallocationSimulatorProps> = ({
  age,
  lifeExpectancy,
  originalActivities,
  originalCalculation,
}) => {
  const [reallocatedActivities, setReallocatedActivities] = useState<Activity[]>([]);
  const [sarcasticMessage, setSarcasticMessage] = useState<string | null>(null);
  const [messageKey, setMessageKey] = useState(0); // Key to force re-render of AnimatePresence

  useEffect(() => {
    // Initialize reallocatedActivities when originalActivities change
    setReallocatedActivities(originalActivities.map(activity => ({ ...activity })));
  }, [originalActivities]);

  const reallocatedCalculation = calculateTimeLeft(age, lifeExpectancy, reallocatedActivities);

  const freeTimeDifferenceYears = reallocatedCalculation.freeTimeYears - originalCalculation.freeTimeYears;
  const freeTimeDifferenceMonths = freeTimeDifferenceYears * 12;

  const handleHoursChange = (
    activityId: string,
    type: 'weekday' | 'weekend',
    change: number // +0.5 or -0.5
  ) => {
    let activityName = '';
    let originalHours = 0;
    let newHours = 0;
    let currentFreeTimeDifferenceMonths = 0; // To capture the latest difference for the sarcastic message
    let deltaHours = 0; // Change in hours for the specific activity

    setReallocatedActivities(prevActivities => {
      const updatedActivities = prevActivities.map(activity => {
        if (activity.id === activityId) {
          activityName = activity.name;
          originalHours = type === 'weekday' ? activity.hoursWeekday : activity.hoursWeekend;

          const newHoursWeekday = type === 'weekday' ? Math.max(0, activity.hoursWeekday + change) : activity.hoursWeekday;
          const newHoursWeekend = type === 'weekend' ? Math.max(0, activity.hoursWeekend + change) : activity.hoursWeekend;

          // Ensure total hours don't exceed 24 for any day
          if (newHoursWeekday > 24 || newHoursWeekend > 24) {
            return activity; // Prevent exceeding 24 hours
          }
          
          newHours = type === 'weekday' ? newHoursWeekday : newHoursWeekend;
          deltaHours = newHours - originalHours; // Calculate deltaHours here

          return {
            ...activity,
            hoursWeekday: newHoursWeekday,
            hoursWeekend: newHoursWeekend,
          };
        }
        return activity;
      });

      // Recalculate free time difference based on updated activities for the sarcastic message
      const tempReallocatedCalculation = calculateTimeLeft(age, lifeExpectancy, updatedActivities);
      const tempFreeTimeDifferenceYears = tempReallocatedCalculation.freeTimeYears - originalCalculation.freeTimeYears;
      currentFreeTimeDifferenceMonths = tempFreeTimeDifferenceYears * 12;

      return updatedActivities;
    });

    // Generate sarcastic comment based on activity and overall free time change
    let selectedComment = null;
    const activityChangeThreshold = 0.4; // Trigger for 0.5h changes
    const overallTimeChangeThreshold = 0.1; // Trigger for cumulative changes

    if (Math.abs(deltaHours) > activityChangeThreshold) { // Check for significant change in the specific activity
      if (activityName === 'Sleep') {
        selectedComment = deltaHours > 0 ? 
          SARCASTIC_TIME_COMMENTS.find(c => c.type === 'sleep-gain') :
          SARCASTIC_TIME_COMMENTS.find(c => c.type === 'sleep-lose');
      } else if (activityName === 'Work') {
        selectedComment = deltaHours > 0 ?
          SARCASTIC_TIME_COMMENTS.find(c => c.type === 'work-gain') :
          SARCASTIC_TIME_COMMENTS.find(c => c.type === 'work-lose');
      }
    }

    // If no specific activity comment, use general gain/lose comment based on overall free time change
    if (!selectedComment && Math.abs(currentFreeTimeDifferenceMonths) > overallTimeChangeThreshold) {
      selectedComment = currentFreeTimeDifferenceMonths > 0 ?
        SARCASTIC_TIME_COMMENTS.find(c => c.type === 'gain') :
        SARCASTIC_TIME_COMMENTS.find(c => c.type === 'lose');
    }

    if (selectedComment) {
      const formattedMonths = formatNumber(Math.abs(currentFreeTimeDifferenceMonths), 1);
      // All message functions now accept both arguments, simplifying the call
      setSarcasticMessage(selectedComment.message(activityName, formattedMonths));
      setMessageKey(prevKey => prevKey + 1); // Update key to trigger AnimatePresence
    } else {
      setSarcasticMessage(null);
    }
  };

  // Generate viral hook
  let viralHookText = '';
  if (freeTimeDifferenceYears > 0.01) { // Use a small threshold to avoid showing for tiny changes
    viralHookText = `By reallocating your time, you could gain ${formatNumber(freeTimeDifferenceMonths)} months of free time!`;
  } else if (freeTimeDifferenceYears < -0.01) {
    viralHookText = `By reallocating your time, you could lose ${formatNumber(Math.abs(freeTimeDifferenceMonths))} months of free time. Is it worth it?`;
  } else {
    viralHookText = `Adjust hours to see how your free time changes!`;
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Time Reallocation Simulator</h2>
      <p className="text-gray-600 mb-4">
        Adjust the hours for your activities below to see how it impacts your total free time.
      </p>

      <div className="space-y-4 mb-6">
        {reallocatedActivities.map(activity => (
          <div 
            key={activity.id} 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded-lg"
            style={{ borderLeft: `4px solid ${activity.color}` }}
          >
            <div className="flex items-center font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/3">
              <DynamicIcon name={activity.icon} size={20} color={activity.color} className="mr-2" />
              <span>{activity.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-2/3 sm:justify-end">
              {/* Weekday Hours */}
              <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200 w-full sm:w-auto">
                <button
                  onClick={() => handleHoursChange(activity.id, 'weekday', -0.5)}
                  className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label={`Decrease weekday hours for ${activity.name}`}
                >
                  <MinusCircle size={20} />
                </button>
                <span className="mx-2 text-gray-800 font-semibold w-12 text-center">
                  {formatNumber(activity.hoursWeekday, 1)}h
                </span>
                <button
                  onClick={() => handleHoursChange(activity.id, 'weekday', 0.5)}
                  className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label={`Increase weekday hours for ${activity.name}`}
                >
                  <PlusCircle size={20} />
                </button>
                <span className="ml-2 text-sm text-gray-500 hidden sm:inline"> (Weekday)</span>
                <Briefcase size={16} className="text-indigo-400 ml-2" />
              </div>

              {/* Weekend Hours (if not same on weekends) */}
              {!activity.sameOnWeekends && (
                <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => handleHoursChange(activity.id, 'weekend', -0.5)}
                    className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label={`Decrease weekend hours for ${activity.name}`}
                  >
                    <MinusCircle size={20} />
                  </button>
                  <span className="mx-2 text-gray-800 font-semibold w-12 text-center">
                    {formatNumber(activity.hoursWeekend, 1)}h
                  </span>
                  <button
                    onClick={() => handleHoursChange(activity.id, 'weekend', 0.5)}
                    className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label={`Increase weekend hours for ${activity.name}`}
                  >
                    <PlusCircle size={20} />
                  </button>
                  <span className="ml-2 text-sm text-gray-500 hidden sm:inline"> (Weekend)</span>
                  <PartyPopper size={16} className="text-orange-400 ml-2" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary-50 p-4 rounded-lg text-center mb-4">
        <p className="text-lg font-semibold text-primary-800">
          {viralHookText}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {sarcasticMessage && (
          <motion.div
            key={messageKey} // Key changes to force re-mount and re-animation
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-center text-sm mb-4"
          >
            {sarcasticMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TimeReallocationSimulator;
