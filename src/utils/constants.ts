export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'sleep',
    name: 'Sleep',
    icon: 'Moon',
    color: '#6366f1', // indigo-500
    hoursWeekday: 8,
    hoursWeekend: 9,
    sameOnWeekends: false,
    isEditable: true,
  },
  {
    id: 'work',
    name: 'Work',
    icon: 'Briefcase',
    color: '#ef4444', // red-500
    hoursWeekday: 8,
    hoursWeekend: 0,
    sameOnWeekends: false,
    isEditable: true,
  },
  {
    id: 'eat',
    name: 'Eating & Cooking',
    icon: 'Utensils',
    color: '#f97316', // orange-500
    hoursWeekday: 2,
    hoursWeekend: 3,
    sameOnWeekends: false,
    isEditable: true,
  },
  {
    id: 'personal_care',
    name: 'Personal Care',
    icon: 'Bath',
    color: '#a855f7', // purple-500 (changed from green)
    hoursWeekday: 1,
    hoursWeekend: 1,
    sameOnWeekends: true,
    isEditable: true,
  },
  {
    id: 'commute',
    name: 'Commute',
    icon: 'Car',
    color: '#06b6d4', // cyan-500
    hoursWeekday: 1.5,
    hoursWeekend: 0,
    sameOnWeekends: false,
    isEditable: true,
  },
  {
    id: 'gym',
    name: 'Gym',
    icon: 'Dumbbell',
    color: '#10b981', // emerald-500
    hoursWeekday: 1,
    hoursWeekend: 0,
    sameOnWeekends: false,
    isEditable: true,
  },
];
// Exporting ACTIVITY_DEFINITIONS as DEFAULT_ACTIVITIES
export const DEFAULT_AGE = 26;
export const DEFAULT_LIFE_EXPECTANCY = 75; // Adjusted for general relevance
export const DAYS_IN_YEAR = 365.25; // Account for leap years
export const HOURS_IN_DAY = 24;
export const WEEKDAYS_IN_WEEK = 5;
export const WEEKENDS_IN_WEEK = 2;

export const FUN_COMPARISONS = [
  { name: 'Netflix series binges (10h/series)', hours: 10, icon: 'Tv' },
  { name: 'Books read (8h/book)', hours: 8, icon: 'Book' },
  { name: 'Trips to the moon (240h/trip)', hours: 240, icon: 'Rocket' },
  { name: 'Marathons run (4h/marathon)', hours: 4, icon: 'Footprints' },
  { name: 'Concerts attended (3h/concert)', hours: 3, icon: 'Music' },
];

export const SARCASTIC_TIME_COMMENTS = [
  {
    type: 'sleep-gain',
    message: (activityName: string, formattedMonths: string) => `More sleep, huh? Becoming an over sleeper, are we? Enjoy those extra ${formattedMonths} months of dreaming!`,
  },
  {
    type: 'sleep-lose',
    message: (activityName: string, formattedMonths: string) => `Cutting down on sleep? Someone doesn't care about their beauty rest! Hope you enjoy those extra ${formattedMonths} months of being tired.`,
  },
  {
    type: 'work-gain',
    message: (activityName: string, formattedMonths: string) => `Adding more work hours? Welcome to the corporate slave club! Hope those extra ${formattedMonths} months of grind are fulfilling.`,
  },
  {
    type: 'work-lose',
    message: (activityName: string, formattedMonths: string) => `Less work? Are you sure you're not secretly planning a rebellion? Enjoy those ${formattedMonths} months of freedom!`,
  },
  {
    type: 'gain', // General gain in free time
    message: (activityName: string, formattedMonths: string) => `Oh, look at you, gaining ${formattedMonths} months of free time by adjusting ${activityName}! What are you, a time wizard?`,
  },
  {
    type: 'lose', // General loss in free time
    message: (activityName: string, formattedMonths: string) => `You just lost ${formattedMonths} months of free time by adjusting ${activityName}. Hope it was worth it, corporate slave!`,
  },
];
export const SHARE_TEMPLATES: ShareTemplate[] = [
  {
    id: 'classic-meme',
    name: 'Classic Meme',
    title: 'My Life in Years!',
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // Warm, inviting
    textColor: '#333',
    quote: 'Time flies when you\'re... well, living!',
    icon: 'Clock',
  },
  {
    id: 'minimalist-insight',
    name: 'Minimalist Insight',
    title: 'The Truth About My Time',
    background: '#f0f0f0', // Clean, modern
    textColor: '#222',
    quote: 'Every second counts. Or does it?',
    icon: 'Lightbulb',
  },
  {
    id: 'vibrant-dream',
    name: 'Vibrant Dream',
    title: 'Unlocking My Future Years!',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Soft, dreamy pastels
    textColor: '#4a4a4a',
    quote: 'Dream big, live bigger!',
    icon: 'Sparkles',
  },
  {
    id: 'indian-vibe',
    name: 'Desi Time Capsule',
    title: 'My Life, My Time, My India!',
    background: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)', // Indian flag colors
    textColor: '#333',
    quote: 'From chai breaks to big dreams, every moment counts!',
    icon: 'Leaf',
  },
  {
    id: 'deep-blue',
    name: 'Deep Reflection',
    title: 'Time: A Deeper Look',
    background: 'linear-gradient(135deg, #2a2a72 0%, #009ffd 100%)', // Deep blue, thoughtful
    textColor: '#e0e0e0',
    quote: 'The only true currency is time.',
    icon: 'Hourglass',
  },
];

export const BUCKET_LIST_IDEAS = [
  { id: 'travel_india', name: 'Travel across India', estimatedHours: 500, icon: 'Map' },
  { id: 'learn_instrument', name: 'Learn a musical instrument (e.g., Sitar)', estimatedHours: 300, icon: 'Music' },
  { id: 'write_book', name: 'Write a book', estimatedHours: 1000, icon: 'Book' },
  { id: 'volunteer', name: 'Volunteer for a cause (e.g., teaching underprivileged children)', estimatedHours: 200, icon: 'Heart' },
  { id: 'start_business', name: 'Start a small business', estimatedHours: 2000, icon: 'Rocket' },
  { id: 'master_cooking', name: 'Master Indian regional cooking', estimatedHours: 400, icon: 'ChefHat' },
  { id: 'trek_himalayas', name: 'Trek in the Himalayas', estimatedHours: 150, icon: 'Mountain' },
  { id: 'learn_yoga', name: 'Learn advanced Yoga/Meditation', estimatedHours: 250, icon: 'Lotus' },
  { id: 'visit_temples', name: 'Visit all major temples/historical sites in India', estimatedHours: 600, icon: 'Building' },
  { id: 'learn_new_language', name: 'Learn a new Indian language', estimatedHours: 350, icon: 'Languages' },
];

export const QUIRKY_BUCKET_LIST_IDEAS = [
  { id: 'pet_tiger', name: 'Attempt to pet a tiger (from a safe distance, obviously)', estimatedHours: 5, icon: 'Cat' },
  { id: 'eat_spiciest', name: 'Eat the spiciest curry in India without crying', estimatedHours: 2, icon: 'Flame' },
  { id: 'dance_bollywood', name: 'Master a Bollywood dance routine', estimatedHours: 50, icon: 'Sparkles' },
  { id: 'find_nirvana', name: 'Achieve true Nirvana (or at least a really good nap)', estimatedHours: 9999, icon: 'Cloud' },
  { id: 'teach_parrot', name: 'Teach a parrot to recite Shakespeare (or just "Hello")', estimatedHours: 100, icon: 'Bird' },
  { id: 'win_gully_cricket', name: 'Win a gully cricket match with a six on the last ball', estimatedHours: 20, icon: 'Cricket' },
  { id: 'ride_auto', name: 'Negotiate an auto-rickshaw fare like a pro', estimatedHours: 1, icon: 'Car' },
  { id: 'find_best_chai', name: 'Find the best chai stall in India', estimatedHours: 720, icon: 'Coffee' },
];

// Reintroducing DEFAULT_WASTED_ACTIVITIES for the independent TimeDebtCalculator
export const DEFAULT_WASTED_ACTIVITIES: WastedActivity[] = [
  {
    id: 'wasted_social_media',
    name: 'Social Media Scrolling',
    icon: 'Smartphone',
    dailyHours: 1,
    color: '#8b5cf6', // violet-500
  },
  {
    id: 'wasted_browsing',
    name: 'Mindless Browsing',
    icon: 'Globe',
    dailyHours: 1,
    color: '#ec4899', // pink-500
  },
  {
    id: 'wasted_tv',
    name: 'Excessive TV/Streaming',
    icon: 'Tv',
    dailyHours: 1.5,
    color: '#f43f5e', // rose-500
  },
];
