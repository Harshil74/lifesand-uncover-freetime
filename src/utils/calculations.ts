import { Activity, TimeLeftCalculation, UserBucketListItem, WeekData } from '../types';
import { 
  DAYS_IN_YEAR, 
  HOURS_IN_DAY, 
  WEEKDAYS_IN_WEEK, 
  WEEKENDS_IN_WEEK,
  FUN_COMPARISONS // This constant is no longer used for the main breakdown
} from './constants';
import { formatNumber } from './helpers';

export const calculateTimeLeft = (
  age: number,
  lifeExpectancy: number,
  activities: Activity[],
  userBucketListItems: UserBucketListItem[] = [],
): TimeLeftCalculation => {
  const remainingYears = Math.max(0, lifeExpectancy - age);

  // Calculate total hours over the ENTIRE life expectancy
  const totalLifeHours = lifeExpectancy * DAYS_IN_YEAR * HOURS_IN_DAY;

  let totalObligationHoursOverLife = 0;
  const calculatedActivitiesBreakdown: TimeLeftCalculation['activitiesBreakdown'] = [];

  activities.forEach(activity => {
    const totalHoursPerWeek = (activity.hoursWeekday * WEEKDAYS_IN_WEEK) + 
                              ((activity.sameOnWeekends ? activity.hoursWeekday : activity.hoursWeekend) * WEEKENDS_IN_WEEK);
    const hoursPerDayAverage = totalHoursPerWeek / 7; 
    const hoursPerYear = hoursPerDayAverage * DAYS_IN_YEAR;
    
    let activityYearsDuration = lifeExpectancy; 
    if (activity.name === 'Work') {
      const startWorkingAge = 18; 
      const retirementAge = 60;
      activityYearsDuration = Math.max(0, retirementAge - startWorkingAge);
    }

    const totalHoursForActivityOverLife = hoursPerYear * activityYearsDuration;
    const yearsSpentOverLife = totalHoursForActivityOverLife / (HOURS_IN_DAY * DAYS_IN_YEAR);
    
    // As per user's request: "forget the pass years calculation in to account at nonFreeTimeActivities.
    // only calculate the years based on the defined in 'your activities'"
    // So, yearsSpent for activities will be over the *entire* life expectancy.
    calculatedActivitiesBreakdown.push({
      name: activity.name,
      hours: totalHoursForActivityOverLife,
      percentage: (yearsSpentOverLife / lifeExpectancy) * 100, // Percentage of total life expectancy
      yearsSpent: yearsSpentOverLife, // Total years over entire life expectancy
      color: activity.color,
    });
    totalObligationHoursOverLife += totalHoursForActivityOverLife;
  });

  userBucketListItems.forEach(item => {
    const totalHoursForBucketItem = item.estimatedHours;
    const yearsForBucketItem = totalHoursForBucketItem / (HOURS_IN_DAY * DAYS_IN_YEAR);

    // As per user's request, yearsSpent for bucket list items will also be total.
    calculatedActivitiesBreakdown.push({
      name: item.name,
      hours: totalHoursForBucketItem,
      percentage: (yearsForBucketItem / lifeExpectancy) * 100, // Percentage of total life expectancy
      yearsSpent: yearsForBucketItem, // Total years for bucket item
      color: '#6366f1',
    });
    totalObligationHoursOverLife += totalHoursForBucketItem;
  });
  
  const totalFreeTimeHoursOverLife = Math.max(0, totalLifeHours - totalObligationHoursOverLife);
  const totalFreeTimeYearsOverLife = totalFreeTimeHoursOverLife / (HOURS_IN_DAY * DAYS_IN_YEAR);
  
  // This is the remaining free time, which will be the main number and also the 'Free Time' card number.
  // This still needs to be scaled to remaining years for consistency with the main display.
  const freeTimeYearsRemaining = totalFreeTimeYearsOverLife * (remainingYears / lifeExpectancy);
  const freeTimeDaysRemaining = freeTimeYearsRemaining * DAYS_IN_YEAR;
  const freeTimePercentageRemaining = remainingYears > 0 ? (freeTimeYearsRemaining / remainingYears) * 100 : 0;
  
  // Add 'Free Time' to the breakdown, using the *remaining* free time
  calculatedActivitiesBreakdown.push({
    name: 'Free Time',
    hours: totalFreeTimeHoursOverLife, // Still total hours over life expectancy
    percentage: freeTimePercentageRemaining, // Percentage of remaining life
    yearsSpent: freeTimeYearsRemaining, // This will now match the main display
    color: '#10b981',
  });

  // --- New Life Breakdown Comparisons (sum to lifeExpectancy, activities from current age, free time matches freeTimeYearsRemaining) ---
  const lifeBreakdownComparisons = [];
  let sumOfExplicitComparisons = 0; // This will track the sum of items *before* miscellaneous

  // 1. Years Passed (matches current age)
  const yearsPassedForBreakdown = age;
  lifeBreakdownComparisons.push({
    name: 'Years Passed',
    value: yearsPassedForBreakdown,
    icon: 'Calendar',
  });
  sumOfExplicitComparisons += yearsPassedForBreakdown;

  // 2. Years on Defined Activities (calculated from current age to life expectancy)
  activities.forEach(activity => {
    const totalHoursPerWeek = (activity.hoursWeekday * WEEKDAYS_IN_WEEK) +
                              ((activity.sameOnWeekends ? activity.hoursWeekday : activity.hoursWeekend) * WEEKENDS_IN_WEEK);
    const hoursPerDayAverage = totalHoursPerWeek / 7;
    const hoursPerYear = hoursPerDayAverage * DAYS_IN_YEAR;

    let effectiveStartAge = age;
    let effectiveEndAge = lifeExpectancy;

    if (activity.name === 'Work') {
      const startWorkingAge = 18;
      const retirementAge = 60;
      effectiveStartAge = Math.max(age, startWorkingAge); // Work starts at current age or 18, whichever is later
      effectiveEndAge = Math.min(lifeExpectancy, retirementAge); // Work ends at life expectancy or 60, whichever is earlier
    }
    // For other activities, they are assumed to continue until life expectancy from current age.

    const durationInYearsForActivity = Math.max(0, effectiveEndAge - effectiveStartAge);
    let yearsSpentOnActivityRemaining = (hoursPerYear * durationInYearsForActivity) / (HOURS_IN_DAY * DAYS_IN_YEAR);

    // Apply Math.floor for activity years as requested
    const flooredYearsForActivity = Math.floor(yearsSpentOnActivityRemaining);

    if (flooredYearsForActivity > 0) { // Only add if significant after flooring
      const iconMap: { [key: string]: string } = {
        'Sleep': 'Moon',
        'Work': 'Briefcase',
        'Eating & Cooking': 'Utensils',
        'Personal Care': 'Bath',
        'Commute': 'Car',
        'Gym': 'Dumbbell',
        'New Activity': 'Sparkles', // Default for custom activities
      };
      const iconName = iconMap[activity.name] || 'Hourglass';

      lifeBreakdownComparisons.push({
        name: `Years on ${activity.name}`,
        value: flooredYearsForActivity,
        icon: iconName,
      });
      sumOfExplicitComparisons += flooredYearsForActivity;
    }
  });

  // 3. Free Time (Remaining Life) - MUST match calculation.freeTimeYears
  // This is the free time from the main calculation, which is scaled to remaining years
  // but its base is derived from total life obligations.
  lifeBreakdownComparisons.push({
    name: 'Free Time (Remaining Life)',
    value: freeTimeYearsRemaining, // This is calculation.freeTimeYears
    icon: 'Sparkles',
  });
  sumOfExplicitComparisons += freeTimeYearsRemaining;

  // 4. Miscellaneous (to make the sum authentic and account for any discrepancies)
  // This will absorb any difference to make the total sum to lifeExpectancy.
  // It should always be positive or zero now due to flooring activities.
  const miscellaneousYearsForBreakdown = lifeExpectancy - sumOfExplicitComparisons;

  // Ensure miscellaneous is not negative, though with floor it should be positive or zero.
  // If it somehow becomes negative due to very small floating point inaccuracies, clamp it to 0.
  const finalMiscellaneous = Math.max(0, miscellaneousYearsForBreakdown);

  if (finalMiscellaneous > 0.01) { // Only add if significant
    lifeBreakdownComparisons.push({
      name: 'Miscellaneous',
      value: finalMiscellaneous,
      icon: 'Hourglass',
    });
  }
  // --- End New Life Breakdown Comparisons ---
  
  return {
    totalYears: remainingYears, // This is remaining life expectancy
    freeTimeYears: freeTimeYearsRemaining, // This is remaining free time
    freeTimeDays: freeTimeDaysRemaining,
    freeTimePercentage: freeTimePercentageRemaining,
    activitiesBreakdown: calculatedActivitiesBreakdown, // Activities are total, Free Time is remaining
    // funComparisons, // Removed
    lifeBreakdownComparisons, // New property
  };
};

export const getHumorousInsight = (calculation: TimeLeftCalculation): string => {
  const sleepActivity = calculation.activitiesBreakdown.find(a => a.name === 'Sleep');
  const workActivity = calculation.activitiesBreakdown.find(a => a.name === 'Work');
  const commuteActivity = calculation.activitiesBreakdown.find(a => a.name === 'Commute');
  
  if (sleepActivity && sleepActivity.yearsSpent > 25) {
    return `You'll spend ${formatNumber(sleepActivity.yearsSpent)} years sleeping... That's a lot of dreams! 💤`;
  }
  
  if (workActivity && workActivity.yearsSpent > 20) {
    return `You'll spend ${formatNumber(workActivity.yearsSpent)} years working. Have you considered winning the lottery? 💰`;
  }
  
  if (commuteActivity && commuteActivity.yearsSpent > 3) {
    return `Your commute will take ${formatNumber(commuteActivity.yearsSpent)} years of your life. That's like driving to the moon and back ${Math.floor(commuteActivity.yearsSpent / 0.2)} times! 🚗🌕`;
  }
  
  if (calculation.freeTimePercentage < 15) {
    return `Only ${formatNumber(calculation.freeTimePercentage)}% of your life is free time? Might be time for a change! 🤔`;
  }
  
  if (calculation.freeTimePercentage > 35) {
    return `${formatNumber(calculation.freeTimePercentage)}% of your life is free time! You're living the dream! 🎉`;
  }
  
  return `You have ${formatNumber(calculation.freeTimeYears)} years of free time left. Use them wisely! ⏳`;
};

export const generateLifeInWeeks = (
  age: number,
  lifeExpectancy: number,
  activitiesBreakdown: TimeLeftCalculation['activitiesBreakdown']
): WeekData[] => {
  const totalWeeksInLife = lifeExpectancy * 52;
  const weeksPassed = age * 52;
  const allWeeks: WeekData[] = [];

  // Add past weeks
  for (let i = 0; i < weeksPassed; i++) {
    allWeeks.push({
      id: i,
      type: 'past',
      color: '#d1d5db', // gray-300
      tooltip: `Week ${i + 1}: Past`,
    });
  }

  const remainingYears = Math.max(0, lifeExpectancy - age);
  const totalRemainingWeeks = remainingYears * 52;

  let currentFutureWeekId = weeksPassed;
  const freeTimeWeeks: WeekData[] = [];

  // Add weeks for all activities EXCEPT 'Free Time' first
  const nonFreeTimeActivities = activitiesBreakdown.filter(a => a.name !== 'Free Time');
  
  // Sort non-free time activities for consistent grouping (e.g., by yearsSpent descending, then by name)
  const sortedNonFreeTimeActivities = [...nonFreeTimeActivities].sort((a, b) => {
    return b.yearsSpent - a.yearsSpent; 
  });

  sortedNonFreeTimeActivities.forEach(activity => {
    if (activity.yearsSpent > 0) {
      // For visualization, we use the yearsSpent from the breakdown, which is now scaled to remaining years
      const numWeeks = Math.round(activity.yearsSpent * 52);
      for (let i = 0; i < numWeeks; i++) {
        allWeeks.push({
          id: currentFutureWeekId,
          type: 'activity',
          color: activity.color,
          tooltip: `${activity.name}`,
        });
        currentFutureWeekId++;
      }
    }
  });

  // Now add 'Free Time' weeks (including what was previously unallocated)
  const freeTimeActivity = activitiesBreakdown.find(a => a.name === 'Free Time');
  if (freeTimeActivity && freeTimeActivity.yearsSpent > 0) {
    // Use the yearsSpent from the breakdown, which is now the remaining free time
    const numWeeks = Math.round(freeTimeActivity.yearsSpent * 52);
    for (let i = 0; i < numWeeks; i++) {
      freeTimeWeeks.push({
        id: currentFutureWeekId,
        type: 'free',
        color: freeTimeActivity.color,
        tooltip: 'Free Time',
      });
      currentFutureWeekId++;
    }
  }

  // Fill any remaining unallocated weeks, now treating them as 'Free Time'
  // This ensures the total number of future weeks matches totalRemainingWeeks
  const allocatedFutureWeeksCount = currentFutureWeekId - weeksPassed;
  const unallocatedWeeksCount = totalRemainingWeeks - allocatedFutureWeeksCount;
  const freeTimeColor = '#10b981'; // emerald-500

  for (let i = 0; i < unallocatedWeeksCount; i++) {
    freeTimeWeeks.push({
      id: currentFutureWeekId,
      type: 'free', // Treat as free time
      color: freeTimeColor, 
      tooltip: 'Free Time (Unallocated)',
    });
    currentFutureWeekId++;
  }

  // Append all free time weeks to the end of the allWeeks array
  allWeeks.push(...freeTimeWeeks);

  return allWeeks;
};
