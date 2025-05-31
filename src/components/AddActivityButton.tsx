import React from 'react';
import * as LucideIcons from 'lucide-react';

interface AddActivityButtonProps {
  onAddActivity: () => void;
}

const AddActivityButton: React.FC<AddActivityButtonProps> = ({ onAddActivity }) => {
  return (
    <button
      onClick={onAddActivity}
      className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors duration-300 shadow-md mt-4"
    >
      <LucideIcons.PlusCircle size={20} className="mr-2" />
      Add New Activity
    </button>
  );
};

export default AddActivityButton;
