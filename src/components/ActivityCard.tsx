import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  PencilLine, 
  Save, 
  CheckCircle, 
  Plus, 
  X, 
  Moon, 
  Sun 
} from 'lucide-react';
import { Activity } from '../types';
import { getRandomId } from '../utils/helpers';
import DynamicIcon from './DynamicIcon';

interface ActivityCardProps {
  activity: Activity;
  updateActivity: (updatedActivity: Activity) => void;
  deleteActivity?: () => void;
  isNew?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  updateActivity, 
  deleteActivity,
  isNew = false
}) => {
  const [isEditing, setIsEditing] = React.useState(isNew);
  const [editedActivity, setEditedActivity] = React.useState<Activity>({...activity});

  const handleSave = () => {
    if (editedActivity.name.trim() === '') {
      alert('Activity name cannot be empty!');
      return;
    }
    updateActivity(editedActivity);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedActivity({...activity});
    setIsEditing(false);
    if (isNew && deleteActivity) {
      deleteActivity();
    }
  };

  const toggleSameOnWeekends = () => {
    const updated = {
      ...editedActivity,
      sameOnWeekends: !editedActivity.sameOnWeekends,
    };
    
    if (updated.sameOnWeekends) {
      updated.hoursWeekend = updated.hoursWeekday;
    }
    
    setEditedActivity(updated);
    
    if (!isEditing) {
      updateActivity(updated);
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={cardVariants}
      className="bg-white rounded-xl shadow-md p-5 mb-4"
      style={{ borderTop: `4px solid ${activity.color}` }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Name
            </label>
            <input
              type="text"
              value={editedActivity.name}
              onChange={(e) => setEditedActivity({...editedActivity, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Exercise, Gaming"
              autoFocus
            />
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={toggleSameOnWeekends}
              className={`flex items-center text-sm px-3 py-1 rounded-full ${
                editedActivity.sameOnWeekends 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {editedActivity.sameOnWeekends ? (
                <CheckCircle size={16} className="mr-1" />
              ) : (
                <Plus size={16} className="mr-1" />
              )}
              Same on weekends
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-primary-500 hover:text-primary-700 rounded-full hover:bg-primary-50"
              >
                <Save size={18} />
              </button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Moon size={16} className="text-indigo-400 mr-2" />
              <label className="block text-sm font-medium text-gray-700">
                Weekday Hours: {editedActivity.hoursWeekday}
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={editedActivity.hoursWeekday}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                const updated = {...editedActivity, hoursWeekday: value};
                if (updated.sameOnWeekends) {
                  updated.hoursWeekend = value;
                }
                setEditedActivity(updated);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
          
          {!editedActivity.sameOnWeekends && (
            <div>
              <div className="flex items-center mb-2">
                <Sun size={16} className="text-orange-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Weekend Hours: {editedActivity.hoursWeekend}
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={editedActivity.hoursWeekend}
                onChange={(e) => setEditedActivity({
                  ...editedActivity, 
                  hoursWeekend: parseFloat(e.target.value)
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <DynamicIcon 
                name={activity.icon} 
                size={20} 
                className="mr-2" 
                color={activity.color} 
              />
              {activity.name}
            </h3>
            
            <div className="flex space-x-1">
              {activity.isEditable !== false && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <PencilLine size={16} />
                </button>
              )}
              {deleteActivity && (
                <button
                  onClick={deleteActivity}
                  className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center text-gray-600">
                  <Moon size={14} className="text-indigo-400 mr-1.5" />
                  Weekdays
                </span>
                <span className="font-semibold">{activity.hoursWeekday} hrs/day</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-indigo-400 h-1.5 rounded-full" 
                  style={{ width: `${(activity.hoursWeekday / 24) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center text-gray-600">
                  <Sun size={14} className="text-orange-400 mr-1.5" />
                  Weekends
                </span>
                <span className="font-semibold">
                  {activity.sameOnWeekends ? activity.hoursWeekday : activity.hoursWeekend} hrs/day
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-orange-400 h-1.5 rounded-full" 
                  style={{ 
                    width: `${((activity.sameOnWeekends ? activity.hoursWeekday : activity.hoursWeekend) / 24) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <button
            onClick={toggleSameOnWeekends}
            className={`mt-4 flex items-center text-xs px-2.5 py-1 rounded-full ${
              activity.sameOnWeekends 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {activity.sameOnWeekends ? (
              <CheckCircle size={12} className="mr-1" />
            ) : (
              <Plus size={12} className="mr-1" />
            )}
            Same on weekends
          </button>
        </>
      )}
    </motion.div>
  );
};

export const AddActivityButton: React.FC<{
  onAddActivity: () => void;
}> = ({ onAddActivity }) => {
  return (
    <motion.button
      onClick={onAddActivity}
      className="w-full bg-white rounded-xl shadow-md p-4 mb-4 border-2 border-dashed border-gray-300
                hover:border-primary-300 flex items-center justify-center text-gray-500 hover:text-primary-500"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Plus size={20} className="mr-2" />
      <span className="font-medium">Add Custom Activity</span>
    </motion.button>
  );
};

export const createNewActivity = (): Activity => ({
  id: getRandomId(),
  name: '',
  icon: 'Activity',
  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  hoursWeekday: 1,
  hoursWeekend: 1,
  sameOnWeekends: true,
  isCustom: true,
  isEditable: true,
});

export default ActivityCard;
