import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import AgeInput from './components/AgeInput';
import ActivityCard from './components/ActivityCard';
import AddActivityButton from './components/AddActivityButton';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import BuyMeACoffeeModal from './components/BuyMeACoffeeModal';
import { DEFAULT_ACTIVITIES, DEFAULT_AGE, DEFAULT_LIFE_EXPECTANCY } from './utils/constants';
import { calculateTimeLeft } from './utils/calculations';
import { Activity, UserBucketListItem } from './types';
import { getRandomId } from './utils/helpers';

// Lazy load components for performance
const ResultsVisualization = React.lazy(() => import('./components/ResultsVisualization'));
const ResultsSummary = React.lazy(() => import('./components/ResultsSummary'));
const LifeInWeeksVisualization = React.lazy(() => import('./components/LifeInWeeksVisualization'));
const TimeReallocationSimulator = React.lazy(() => import('./components/TimeReallocationSimulator'));
const BucketListGenerator = React.lazy(() => import('./components/BucketListGenerator'));
const TimeDebtCalculator = React.lazy(() => import('./components/TimeDebtCalculator'));

const App: React.FC = () => {
  const [age, setAge] = useState<number>(DEFAULT_AGE);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(DEFAULT_LIFE_EXPECTANCY);
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [userBucketListItems, setUserBucketListItems] = useState<UserBucketListItem[]>([]);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showBuyMeACoffeeModal, setShowBuyMeACoffeeModal] = useState<boolean>(false);

  const handleStartApp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowLandingPage(false);
      setIsLoading(false);
    }, 1500); // Simulate a 1.5 second loading time
  };
  
  const createNewActivity = (): Activity => ({
    id: getRandomId(),
    name: 'New Activity',
    icon: 'Sparkles',
    color: '#9ca3af', // gray-400
    hoursWeekday: 1,
    hoursWeekend: 1,
    sameOnWeekends: true,
    isCustom: true,
    isEditable: true,
  });

  const handleUpdateActivity = (updatedActivity: Activity) => {
    setActivities(activities.map(activity => 
      activity.id === updatedActivity.id ? updatedActivity : activity
    ));
  };
  
  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };
  
  const handleAddActivity = () => {
    setActivities([...activities, createNewActivity()]);
  };

  const handleAddUserBucketListItem = (newItem: UserBucketListItem) => {
    setUserBucketListItems(prevItems => [...prevItems, newItem]);
  };

  const handleRemoveUserBucketListItem = (itemId: string) => {
    setUserBucketListItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleUpdateUserBucketListItem = (itemId: string, newHours: number) => {
    setUserBucketListItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, estimatedHours: newHours } : item
      )
    );
  };
  
  const timeLeftCalculation = calculateTimeLeft(age, lifeExpectancy, activities, userBucketListItems);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const getTotalHoursWarning = () => {
    const totalWeekdayHours = activities.reduce((total, activity) => total + activity.hoursWeekday, 0);
    const totalWeekendHours = activities.reduce((total, activity) => {
      return total + (activity.sameOnWeekends ? activity.hoursWeekday : activity.hoursWeekend);
    }, 0);
    
    if (totalWeekdayHours > 24) {
      return `Your weekday activities total ${totalWeekdayHours.toFixed(1)} hours, which exceeds 24 hours in a day!`;
    }
    
    if (totalWeekendHours > 24) {
      return `Your weekend activities total ${totalWeekendHours.toFixed(1)} hours, which exceeds 24 hours in a day!`;
    }
    
    return null;
  };
  
  const hoursWarning = getTotalHoursWarning();
  
  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading-screen" />
        )}
        {showLandingPage && !isLoading && (
          <motion.div
            key="landing-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
          >
            <LandingPage onStart={handleStartApp} />
            <Footer onOpenBuyMeACoffee={() => setShowBuyMeACoffeeModal(true)} />
          </motion.div>
        )}
        {!showLandingPage && !isLoading && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-100 font-nunito pb-12 flex flex-col"
          >
            <div className="container mx-auto px-4 py-8 flex-grow">
              <Header />
              
              {/* Main content area, now using a responsive grid */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 items-stretch"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Left Column: User Inputs & Daily Activities */}
                <motion.div variants={itemVariants} className="space-y-6 flex flex-col">
                  <AgeInput 
                    age={age} 
                    setAge={setAge} 
                    lifeExpectancy={lifeExpectancy} 
                    setLifeExpectancy={setLifeExpectancy} 
                  />
                  
                  <div className="bg-white rounded-xl shadow-md p-6 flex-grow overflow-y-auto">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Daily Activities</h2>
                    
                    {hoursWarning && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-3 bg-accent-100 text-accent-800 rounded-lg text-sm"
                      >
                        ⚠️ {hoursWarning}
                      </motion.div>
                    )}
                    
                    <AnimatePresence>
                      {activities.map(activity => (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          updateActivity={handleUpdateActivity}
                          deleteActivity={() => handleDeleteActivity(activity.id)}
                        />
                      ))}
                    </AnimatePresence>
                    
                    <AddActivityButton onAddActivity={handleAddActivity} />
                  </div>
                </motion.div>
                
                {/* Right Column: Results Visualization & Summary */}
                <motion.div variants={itemVariants} className="space-y-6 flex flex-col">
                  <Suspense fallback={<div>Loading visualization...</div>}>
                    <ResultsVisualization calculation={timeLeftCalculation} />
                  </Suspense>
                  
                  <Suspense fallback={<div>Loading summary...</div>}>
                    <ResultsSummary calculation={timeLeftCalculation} />
                  </Suspense>
                </motion.div>
                
                {/* Full Width Section: Life in Weeks Visualization */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <Suspense fallback={<div>Loading life in weeks...</div>}>
                    <LifeInWeeksVisualization
                      age={age}
                      lifeExpectancy={lifeExpectancy}
                      calculation={timeLeftCalculation}
                    />
                  </Suspense>
                </motion.div>

                {/* Split Section: Time Reallocation & Time Debt */}
                <motion.div variants={itemVariants} className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Suspense fallback={<div>Loading time reallocation simulator...</div>}>
                    <TimeReallocationSimulator
                      age={age}
                      lifeExpectancy={lifeExpectancy}
                      originalActivities={activities}
                      originalCalculation={timeLeftCalculation}
                    />
                  </Suspense>

                  <Suspense fallback={<div>Loading time debt calculator...</div>}>
                    <TimeDebtCalculator
                      age={age}
                      lifeExpectancy={lifeExpectancy}
                    />
                  </Suspense>
                </motion.div>

                {/* Full Width Section: Bucket List Generator */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <Suspense fallback={<div>Loading bucket list generator...</div>}>
                    <BucketListGenerator
                      freeTimeYears={timeLeftCalculation.freeTimeYears}
                      userBucketListItems={userBucketListItems}
                      onAddUserBucketListItem={handleAddUserBucketListItem}
                      onRemoveUserBucketListItem={handleRemoveUserBucketListItem}
                      onUpdateUserBucketListItem={handleUpdateUserBucketListItem}
                    />
                  </Suspense>
                </motion.div>
              </motion.div>
            </div>
            <Footer onOpenBuyMeACoffee={() => setShowBuyMeACoffeeModal(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <BuyMeACoffeeModal 
        isOpen={showBuyMeACoffeeModal} 
        onClose={() => setShowBuyMeACoffeeModal(false)} 
      />
    </>
  );
}
export default App;
