export interface Activity {
  id: string;
  name: string;
  icon: string;
  color: string;
  hoursWeekday: number;
  hoursWeekend: number;
  sameOnWeekends: boolean;
  isCustom?: boolean;
  isEditable?: boolean;
  // Removed isTimeSink from Activity as it's now a separate concept for TimeDebtCalculator
}

export interface WastedActivity {
  id: string;
  name: string;
  icon: string;
  dailyHours: number;
  color: string;
}

export interface UserBucketListItem {
  id: string;
  name: string;
  estimatedHours: number;
  icon: string; // Added icon for consistency
}

export interface TimeLeftCalculation {
  totalYears: number;
  freeTimeYears: number;
  freeTimeDays: number;
  freeTimePercentage: number;
  activitiesBreakdown: {
    name: string;
    hours: number;
    percentage: number;
    yearsSpent: number;
    color: string;
    // Removed isTimeSink from breakdown as it's no longer derived from main activities
  }[];
  // Removed funComparisons as it's replaced by lifeBreakdownComparisons
  lifeBreakdownComparisons: {
    name: string;
    value: number;
    icon: string;
  }[];
  // Removed wastedTimeYears and wastedTimeHoursPerDay from here as they are now calculated independently
}

export interface ShareTemplate {
  id: string;
  name: string;
  title: string;
  background: string; // CSS background property
  textColor: string; // CSS color property
  quote?: string;
  icon?: string; // Lucide icon name
}

export interface WeekData {
  id: number;
  type: 'past' | 'free' | 'activity' | 'unallocated';
  color: string;
  tooltip: string;
}
