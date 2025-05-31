import React from 'react';
import { TimeLeftCalculation, ShareTemplate } from '../types';
import { formatNumber } from '../utils/helpers';
import DynamicIcon from './DynamicIcon';

interface ShareableContentProps {
  calculation: TimeLeftCalculation;
  template: ShareTemplate;
  caption?: string; // Added caption prop
}

const ShareableContent: React.FC<ShareableContentProps> = ({ calculation, template, caption }) => {
  const { freeTimeYears, freeTimePercentage } = calculation;

  return (
    <div
      className={`w-[500px] h-[580px] flex flex-col relative overflow-hidden`} // Increased height and removed justify-center
      style={{ background: template.background, color: template.textColor }}
    >
      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-gray-300 text-sm font-bold opacity-70 select-none pointer-events-none">
        #Lifesand
      </div>

      <div className="flex flex-col items-center flex-grow p-8"> {/* This will grow and push bottom content down */}
        <h1 className="text-3xl font-bold mb-4 text-center">{template.title}</h1>

        <div className="text-center mb-6">
          <p className="text-lg font-medium mb-2">I have</p> {/* Changed to "I have" */}
          <div className="text-6xl font-extrabold leading-tight">
            {formatNumber(freeTimeYears)} years
          </div>
          <p className="text-xl font-medium mt-2">of free time remaining!</p>
          <p className="text-sm mt-2 opacity-90">
            That's about {formatNumber(calculation.freeTimeDays)} days or{' '}
            {formatNumber(freeTimePercentage)}% of my remaining life {/* Changed to "my remaining life" */}
          </p>
        </div>

        {template.quote && (
          <blockquote className="text-center italic text-lg mt-4 max-w-md">
            "{template.quote}"
          </blockquote>
        )}

				<div className="w-[80px] h-[80px] mt-4 mb-4 flex items-center justify-center">
    <DynamicIcon
      name={template.icon}
      size={80}
      className="opacity-80 block h-full w-full"
    />
  </div>
      </div>

      {/* Suggested Caption and Call to Action - now part of the flow, not absolute */}
      <div className="text-center px-4 pb-8"> {/* Added pb-8 for bottom padding */}
        {caption && (
          <p className="text-sm font-medium mb-1 opacity-90">{caption}</p>
        )}
        <p className="text-xs opacity-80">
          Find your freedom at <a href="https://lifesand.netlify.app/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">lifesand</a> {/* Changed URL and text */}
        </p>
      </div>
    </div>
  );
};

export default ShareableContent;
