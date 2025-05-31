import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import ShareableContent from './ShareableContent';
import { ShareTemplate, TimeLeftCalculation } from '../types';
import html2canvas from 'html2canvas';
import DynamicIcon from './DynamicIcon';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculation: TimeLeftCalculation | null;
  templates: ShareTemplate[];
  caption?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, calculation, templates, caption }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]); // Set first template as default
    }
  }, [isOpen, templates, selectedTemplate]);

  useEffect(() => {
    if (isOpen && calculation && selectedTemplate) {
      generateImage();
    }
  }, [isOpen, calculation, selectedTemplate]); // Regenerate image when template or calculation changes

  const generateImage = async () => {
    if (!calculation || !selectedTemplate) return;

    setIsGenerating(true);
    setGeneratedImageUrl(null); // Clear previous image

    const shareableContentElement = document.getElementById('shareable-content-to-capture');
    if (shareableContentElement) {
      // Ensure the element is visible for html2canvas, even if off-screen
      shareableContentElement.style.display = 'block';
      shareableContentElement.style.position = 'absolute';
      shareableContentElement.style.left = '-9999px';
      shareableContentElement.style.top = '-9999px';

      try {
        const canvas = await html2canvas(shareableContentElement, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null, // Transparent background
          scale: 2, // Increase scale for better quality
        });
        setGeneratedImageUrl(canvas.toDataURL('image/png'));
      } catch (error) {
        console.error('Error generating image:', error);
        setGeneratedImageUrl(null);
      } finally {
        setIsGenerating(false);
        // Hide it again
        shareableContentElement.style.display = 'none';
      }
    } else {
      console.error("Shareable content element not found for capture.");
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = 'lifesand-summary.png'; // Changed filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShareSocialMedia = async () => {
    if (generatedImageUrl) {
      try {
        const response = await fetch(generatedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'lifesand-summary.png', { type: 'image/png' }); // Changed filename

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My Lifesand Summary', // Changed title
            text: caption || 'Check out my Lifesand summary! Find your free time at lifesand.app', // Changed text
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          alert('Web Share API not supported. You can download the image and share it manually!');
          // Optionally, you could open a new tab to a generic share service or prompt for manual copy
        }
      } catch (err) {
        console.error('Failed to share:', err);
        alert('Failed to share. Please try downloading the image instead.');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking outside
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative flex flex-col max-h-[90vh] overflow-y-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
              aria-label="Close share modal"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Share My Lifesand Summary</h2> {/* Changed title */}

            {/* Shareable Content Preview */}
            <motion.div 
              className="mb-6 flex justify-center items-center bg-gray-50 rounded-lg p-2 flex-grow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isGenerating ? (
                <p className="text-center text-gray-600 animate-pulse">Generating image...</p>
              ) : generatedImageUrl ? (
                <img src={generatedImageUrl} alt="Lifesand Summary" className="max-w-full h-auto rounded-lg shadow-md border border-gray-200" /> 
              ) : (
                <p className="text-center text-gray-600">Select a template to generate image.</p>
              )}
            </motion.div>

            {/* Template Selection Grid */}
            <motion.div 
              className="mb-6 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Choose a Template:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    className={`relative w-14 h-14 rounded-full shadow-md flex items-center justify-center text-center cursor-pointer transition-all duration-200 border-2 overflow-hidden
                      ${selectedTemplate?.id === template.id ? 'border-primary-500 ring-4 ring-primary-200 scale-110' : 'border-transparent hover:scale-105 hover:shadow-lg'}`}
                    style={{ background: template.background, color: template.textColor }}
                    onClick={() => setSelectedTemplate(template)}
                    title={template.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {template.icon && (
                      <DynamicIcon name={template.icon} size={20} />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Hidden ShareableContent for html2canvas capture */}
            {calculation && selectedTemplate && (
              <div id="shareable-content-to-capture" style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                display: 'block',
                width: '500px',
                height: '580px',
                overflow: 'hidden',
              }}>
                <ShareableContent calculation={calculation} template={selectedTemplate} caption={caption} />
              </div>
            )}

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <button
                onClick={handleDownload}
                disabled={!generatedImageUrl || isGenerating}
                className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="mr-2" size={20} />
                Download
              </button>
              <button
                onClick={handleShareSocialMedia}
                disabled={!generatedImageUrl || isGenerating}
                className="flex-1 bg-secondary-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:bg-secondary-600 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DynamicIcon name="Share2" className="mr-2" size={20} />
                Share
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
