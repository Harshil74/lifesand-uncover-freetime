import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Hourglass, Leaf, Brain } from 'lucide-react';
import ScreenshotFeature from './ScreenshotFeature';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="relative min-h-screen flex flex-col justify-between font-nunito text-gray-800 overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background elements for modern aesthetic */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-20 max-w-6xl mx-auto p-4 flex-grow flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center mt-12 mb-16 md:mb-24">
          <motion.div variants={itemVariants} className="mb-6">
            <Clock size={72} className="text-primary-600 mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-600 drop-shadow-md">
              Lifesand: Uncover Your True Free Time.
            </h1>
          </motion.div>
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Beyond the daily grind, how much precious free time do you truly have? Lifesand helps you visualize your remaining hours, identify time sinks, and empower you to live every moment with intention and purpose.
          </motion.p>
          <motion.button
            variants={itemVariants}
            onClick={onStart}
            className="px-10 py-5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary-300"
          >
            Start Your Time Journey
          </motion.button>
        </div>

        {/* New Screenshots Section */}
        <div className="relative z-20 max-w-6xl mx-auto p-4">
          <motion.div variants={itemVariants} className="text-center mt-16 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-600">
              See Lifesand in Action
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mt-4 max-w-2xl mx-auto">
              Explore the powerful visualizations and tools that help you understand and reclaim your time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 mb-12">
            {/* Screenshot 1: Time Visualization */}
            <ScreenshotFeature
              title="Your Time, Visualized"
              description="Understand how your daily activities consume your precious hours with clear, intuitive charts. See your life's breakdown at a glance."
              imageSrc="/1.png"
              imageAlt="Lifesand Dashboard Screenshot"
              reverse={false}
            />

            {/* Screenshot 2: Life in Weeks */}
            <ScreenshotFeature
              title="Your Life in Weeks"
              description="A powerful visual representation of your entire life, week by week. Greyed out weeks are past, colored weeks show how your remaining time is spent."
              imageSrc="/2.png"
              imageAlt="Lifesand Life in Weeks Screenshot"
              reverse={true}
            />

            {/* Screenshot 3: Bucket List */}
            <ScreenshotFeature
              title="Your Personalized Bucket List"
              description="Based on your estimated free time, discover ideas for what you can realistically achieve. Dream big and start planning!"
              imageSrc="/3.png"
              imageAlt="Lifesand Bucket List Screenshot"
              reverse={false}
            />
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center border border-gray-100 transform hover:scale-102 transition-transform duration-300">
            <Hourglass size={56} className="text-indigo-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">The Sand in Your Hourglass</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We often count our lives in decades, but what about the finite hours of free time? The moments outside of work, sleep, and chores are precious. Are you truly making the most of your "Lifesand" before it runs out?
            </p>
            <img
              src="https://images.pexels.com/photos/3862639/pexels-photo-3862639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Person enjoying free time"
              className="rounded-xl shadow-lg w-full h-64 object-cover mb-4"
            />
            <p className="text-sm text-gray-600 italic">
              "Time is what we want most, but what we use worst." - William Penn
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center border border-gray-100 transform hover:scale-102 transition-transform duration-300">
            <Brain size={56} className="text-teal-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reclaim Your Mind, Reclaim Your Time</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Lifesand helps you visualize your remaining free time, identify hidden time sinks (hello, endless scrolling!), and reallocate hours towards what truly matters. Imagine the skills you could learn, the adventures you could embark on, or the memories you could create.
            </p>
            <img
              src="https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="People collaborating and being productive"
              className="rounded-xl shadow-lg w-full h-64 object-cover mb-4"
            />
            <p className="text-sm text-gray-600 italic">
              "The bad news is time flies. The good news is you're the pilot." - Michael Altshuler
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center md:col-span-2 border border-gray-100 transform hover:scale-102 transition-transform duration-300">
            <Leaf size={56} className="text-green-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beyond the Daily Grind</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              It's easy to get caught in the cycle of work, sleep, and repeat. But what about the moments that truly define your life? Lifesand isn't just a calculator; it's a gentle nudge to pause, reflect, and intentionally design a life rich with experiences, learning, and joy. Stop counting days, start making days count!
            </p>
            <img
              src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Person reflecting by a lake"
              className="rounded-xl shadow-lg w-full h-64 object-cover mb-4"
            />
            <p className="text-sm text-gray-600 italic">
              "Don't say you don't have enough time. You have exactly the same number of hours per day that were given to Helen Keller, Pasteur, Michelangelo, Mother Teresa, Leonardo Da Vinci, Thomas Jefferson, and Albert Einstein." - H. Jackson Brown Jr.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
