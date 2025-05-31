import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  name, 
  size = 24, 
  color, 
  className = '' 
}) => {
  const IconComponent = (LucideIcons as Record<string, React.FC<any>>)[name];
  
  if (!IconComponent) {
    // Fallback to Activity icon if the requested icon doesn't exist
    const ActivityIcon = LucideIcons.Activity;
    return <ActivityIcon size={size} color={color} className={className} />;
  }
  
  return <IconComponent size={size} color={color} className={className} />;
};

export default DynamicIcon;
