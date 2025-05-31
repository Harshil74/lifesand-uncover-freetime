import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUCKET_LIST_IDEAS, QUIRKY_BUCKET_LIST_IDEAS } from '../utils/constants';
import { getRandomId } from '../utils/helpers';
import * as LucideIcons from 'lucide-react';
import { UserBucketListItem } from '../types';

interface BucketListGeneratorProps {
  freeTimeYears: number;
  userBucketListItems: UserBucketListItem[];
  onAddUserBucketListItem: (item: UserBucketListItem) => void;
  onRemoveUserBucketListItem: (itemId: string) => void;
  onUpdateUserBucketListItem: (itemId: string, newHours: number) => void; // New prop for updating items
}

interface BucketListItem {
  id: string;
  name: string;
  icon: string;
  category?: string;
  timeYears?: number;
  estimatedHours?: number; // Ensure this is present for adding to user list
}

const getIconComponent = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || LucideIcons.HelpCircle; // Fallback icon
};

const BucketListGenerator: React.FC<BucketListGeneratorProps> = ({ freeTimeYears, userBucketListItems, onAddUserBucketListItem, onRemoveUserBucketListItem, onUpdateUserBucketListItem }) => {
  const [suggestedItems, setSuggestedItems] = useState<BucketListItem[]>([]);
  const [spinningItem, setSpinningItem] = useState<BucketListItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemHours, setNewItemHours] = useState<number | ''>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // State for editing existing items
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedHours, setEditedHours] = useState<number | ''>('');
  const inputRef = useRef<HTMLInputElement>(null); // Ref for auto-focusing the input

  const displayFeedback = (message: string) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackMessage(null);
    }, 3000); // Hide after 3 seconds
  };

  const generateSuggestions = useCallback((years: number) => {
    const possibleItems: BucketListItem[] = [];

    // Filter based on free time
    const shortTerm = BUCKET_LIST_IDEAS.filter(item => item.estimatedHours! / (365 * 24) <= 0.1); // Convert hours to years
    const mediumTerm = BUCKET_LIST_IDEAS.filter(item => item.estimatedHours! / (365 * 24) > 0.1 && item.estimatedHours! / (365 * 24) <= 0.5);
    const longTerm = BUCKET_LIST_IDEAS.filter(item => item.estimatedHours! / (365 * 24) > 0.5);

    if (years >= 0.5) {
      possibleItems.push(...longTerm);
      possibleItems.push(...mediumTerm);
      possibleItems.push(...shortTerm);
    } else if (years >= 0.1) {
      possibleItems.push(...mediumTerm);
      possibleItems.push(...shortTerm);
    } else {
      possibleItems.push(...shortTerm);
    }

    // Select a few random, relevant items, ensuring they are not already in userBucketListItems
    const existingItemNames = new Set(userBucketListItems.map(item => item.name));
    const filteredPossibleItems = possibleItems.filter(item => !existingItemNames.has(item.name));

    const selected: BucketListItem[] = [];
    const shuffled = [...filteredPossibleItems].sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
      selected.push({ ...shuffled[i], id: getRandomId() });
    }
    setSuggestedItems(selected);
  }, [userBucketListItems]); // Re-run if userBucketListItems change

  useEffect(() => {
    generateSuggestions(freeTimeYears);
  }, [freeTimeYears, generateSuggestions]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinningItem(null); // Clear previous item for animation

    const spinDuration = 2000; // 2 seconds

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUIRKY_BUCKET_LIST_IDEAS.length);
      setSpinningItem({ ...QUIRKY_BUCKET_LIST_IDEAS[randomIndex], id: getRandomId() });
      setIsSpinning(false);
    }, spinDuration);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && newItemHours !== '' && newItemHours > 0) {
      const newItem: UserBucketListItem = {
        id: getRandomId(),
        name: newItemName.trim(),
        estimatedHours: newItemHours,
        icon: 'Sparkles', // Default icon for custom items
      };
      onAddUserBucketListItem(newItem);
      displayFeedback(`Successfully added "${newItem.name}"! This utilized ${newItem.estimatedHours} hours of your free time.`);
      setNewItemName('');
      setNewItemHours('');
      // Re-generate suggestions after adding a custom item, as it affects free time
      generateSuggestions(freeTimeYears);
    }
  };

  const handleAddSuggestedItem = (item: BucketListItem) => {
    if (item.estimatedHours === undefined) {
      console.error("Suggested item is missing estimatedHours:", item);
      return;
    }
    const addedItem: UserBucketListItem = {
      id: getRandomId(),
      name: item.name,
      estimatedHours: item.estimatedHours,
      icon: item.icon,
    };
    onAddUserBucketListItem(addedItem);
    displayFeedback(`Successfully added "${addedItem.name}"! This utilized ${addedItem.estimatedHours} hours of your free time.`);
    // Remove the added item from suggestions
    setSuggestedItems(prev => prev.filter(s => s.id !== item.id));
    // Re-generate suggestions to potentially fill the spot
    generateSuggestions(freeTimeYears);
  };

  const handleAddSpunItem = (item: BucketListItem) => {
    if (item.estimatedHours === undefined) {
      console.error("Spun item is missing estimatedHours:", item);
      return;
    }
    const addedItem: UserBucketListItem = {
      id: getRandomId(),
      name: item.name,
      estimatedHours: item.estimatedHours,
      icon: item.icon,
    };
    onAddUserBucketListItem(addedItem);
    displayFeedback(`Successfully added "${addedItem.name}"! This utilized ${addedItem.estimatedHours} hours of your free time.`);
    setSpinningItem(null); // Clear the spun item after adding
    // Re-generate suggestions as free time might have changed
    generateSuggestions(freeTimeYears);
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    onRemoveUserBucketListItem(itemId);
    displayFeedback(`Removed "${itemName}" from your list. Your free time has been updated!`);
    // Re-generate suggestions after removing an item, as it affects free time
    generateSuggestions(freeTimeYears);
  };

  const handleEditClick = (itemId: string, currentHours: number) => {
    setEditingItemId(itemId);
    setEditedHours(currentHours);
    // Use setTimeout to ensure input is rendered before focusing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSaveHours = (itemId: string) => {
    if (editedHours !== '' && editedHours > 0) {
      onUpdateUserBucketListItem(itemId, editedHours);
      displayFeedback(`Updated hours for "${userBucketListItems.find(item => item.id === itemId)?.name}" to ${editedHours} hours.`);
    } else {
      displayFeedback("Estimated hours must be a positive number.");
    }
    setEditingItemId(null);
    setEditedHours('');
    // Re-generate suggestions as free time might have changed
    generateSuggestions(freeTimeYears);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, itemId: string) => {
    if (e.key === 'Enter') {
      handleSaveHours(itemId);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const spinItemVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { type: "spring", damping: 12, stiffness: 150, duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8 }
  };

  const feedbackVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Personalized Bucket List</h2>
      <p className="text-gray-600 mb-4">
        Based on your estimated free time ({freeTimeYears.toFixed(1)} years left!), here are some ideas you could realistically achieve:
      </p>

      <div className="space-y-3 mb-6">
        <AnimatePresence mode="wait">
          {suggestedItems.length > 0 ? (
            suggestedItems.map((item) => {
              const Icon = getIconComponent(item.icon);
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-primary-50 p-3 rounded-lg text-primary-800 font-medium border border-primary-100 hover:shadow-sm transition-shadow duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start flex-grow min-w-0 mb-3 md:mb-0"> {/* Added mb-3 for spacing on mobile */}
                    <Icon size={20} className="mr-3 text-primary-600 flex-shrink-0" />
                    <div className="flex flex-col flex-grow min-w-0">
                      <span className="break-words">{item.name}</span>
                      {item.estimatedHours && (
                        <span className="text-sm text-primary-500">({item.estimatedHours} hrs)</span>
                      )}
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleAddSuggestedItem(item)}
                    className="w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-colors duration-200 shadow-md flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to My List
                  </motion.button>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              key="no-suggestions"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center bg-gray-50 p-3 rounded-lg text-gray-600 font-medium border border-gray-100"
            >
              <LucideIcons.Info size={20} className="mr-3 text-gray-400" />
              <span>Adjust your activities or add custom items to unlock more bucket list ideas!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-3">Feeling Adventurous?</h3>
      <p className="text-gray-600 mb-4">
        Spin the wheel for a truly unique (and perhaps silly) bucket list idea!
      </p>

      <div className="flex flex-col items-center justify-center mb-8">
        <motion.button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`flex items-center px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 ease-in-out
            ${isSpinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-500 hover:bg-accent-600 shadow-lg'}`}
          whileHover={{ scale: isSpinning ? 1 : 1.05 }}
          whileTap={{ scale: isSpinning ? 1 : 0.95 }}
        >
          <LucideIcons.Sparkles size={20} className="mr-2" />
          {isSpinning ? 'Spinning...' : 'Spin for an Idea!'}
        </motion.button>

        <div className="mt-6 min-h-[80px] flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {spinningItem && (
              <motion.div
                key={spinningItem.id}
                variants={spinItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-xl text-center max-w-md"
              >
                <motion.div
                  className="mb-2"
                >
                  {React.createElement(getIconComponent(spinningItem.icon), { size: 32 })}
                </motion.div>
                <span className="text-lg font-bold mb-3 break-words">{spinningItem.name}</span>
                {spinningItem.estimatedHours && (
                  <span className="text-sm text-white/80 mb-3">({spinningItem.estimatedHours} estimated hours)</span>
                )}
                {!isSpinning && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => handleAddSpunItem(spinningItem)}
                    className="px-4 py-2 bg-white text-purple-600 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to My List
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-3">Add Your Own Bucket List Item</h3>
      <p className="text-gray-600 mb-4">
        Dream big! Add an item and estimate the hours it might take. We'll deduct it from your free time.
      </p>

      <form onSubmit={handleAddCustomItem} className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-xl border border-indigo-200">
        <div>
          <label htmlFor="newItemName" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            id="newItemName"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="e.g., Learn to play the guitar"
            className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition duration-200 shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="newItemHours" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Hours (e.g., 100 for a hobby, 8760 for a year of travel)
          </label>
          <input
            type="number"
            id="newItemHours"
            value={newItemHours}
            onChange={(e) => setNewItemHours(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
            placeholder="e.g., 100"
            className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition duration-200 shadow-sm"
            min="1"
            required
          />
        </div>
        <motion.button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LucideIcons.PlusCircle size={20} className="mr-2" />
          Add to My List
        </motion.button>
      </form>

      <AnimatePresence>
        {showFeedback && feedbackMessage && (
          <motion.div
            key="feedback-message"
            variants={feedbackVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-6 p-4 bg-emerald-100 text-emerald-800 rounded-lg shadow-md flex items-center"
          >
            <LucideIcons.CheckCircle size={20} className="mr-3 text-emerald-600" />
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {userBucketListItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Your Custom Bucket List Items</h3>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {userBucketListItems.map((item) => {
                const Icon = getIconComponent(item.icon);
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg text-indigo-800 font-medium border border-indigo-100"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start flex-grow min-w-0">
                      <Icon size={20} className="mr-3 text-indigo-600 flex-shrink-0" />
                      <div className="flex flex-col flex-grow min-w-0">
                        <span className="break-words">{item.name}</span>
                        {editingItemId === item.id ? (
                          <input
                            ref={inputRef}
                            type="number"
                            value={editedHours}
                            onChange={(e) => setEditedHours(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
                            onBlur={() => handleSaveHours(item.id)}
                            onKeyDown={(e) => handleKeyDown(e, item.id)}
                            className="w-24 p-1 border border-indigo-300 rounded-md text-sm focus:ring-1 focus:ring-secondary-500 focus:border-secondary-500 transition duration-200"
                            min="1"
                          />
                        ) : (
                          <span
                            className="text-sm text-indigo-600 cursor-pointer hover:underline"
                            onClick={() => handleEditClick(item.id, item.estimatedHours)}
                            title="Click to edit hours"
                          >
                            ({item.estimatedHours} hours)
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      title="Remove item"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <LucideIcons.X size={18} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BucketListGenerator;
