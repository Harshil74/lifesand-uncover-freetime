import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface AgeInputProps {
  age: number;
  setAge: (age: number) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (age: number) => void;
}

const AgeInput: React.FC<AgeInputProps> = ({ 
  age, 
  setAge, 
  lifeExpectancy, 
  setLifeExpectancy 
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Clock className="mr-2 text-primary-500" size={24} />
        Your Age & Life Expectancy
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="age" className="font-medium text-gray-700">
              Current Age: <span className="text-primary-600 font-bold">{age} years</span>
            </label>
          </div>
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              id="age"
              type="range"
              min="1"
              max="100"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="lifeExpectancy" className="font-medium text-gray-700">
              Expected Lifespan: <span className="text-secondary-600 font-bold">{lifeExpectancy} years</span>
            </label>
          </div>
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              id="lifeExpectancy"
              type="range"
              min="30"
              max="120"
              value={lifeExpectancy}
              onChange={(e) => setLifeExpectancy(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30</span>
              <span>60</span>
              <span>90</span>
              <span>120</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgeInput;
