import React from 'react';
import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { PieChart, Clock, BarChart2 } from 'lucide-react';
import { TimeLeftCalculation } from '../types';
import { formatNumber, formatPercentage } from '../utils/helpers';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ResultsVisualizationProps {
  calculation: TimeLeftCalculation;
}

const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({ calculation }) => {
  const [activeTab, setActiveTab] = React.useState('donut');
  
  // Prepare data for donut chart
  const donutData = {
    labels: calculation.activitiesBreakdown.map(a => a.name),
    datasets: [
      {
        data: calculation.activitiesBreakdown.map(a => a.percentage),
        backgroundColor: calculation.activitiesBreakdown.map(a => a.color),
        borderWidth: 0,
        hoverOffset: 10,
      }
    ]
  };
  
  // Prepare data for bar chart
  const barData = {
    labels: ['Your Lifetime (years)'],
    datasets: calculation.activitiesBreakdown.map(activity => ({
      label: activity.name,
      data: [activity.yearsSpent],
      backgroundColor: activity.color,
      borderColor: activity.color,
      borderWidth: 1,
    }))
  };
  
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Nunito',
            size: 12,
          },
          padding: 15,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const years = (calculation.totalYears * value) / 100;
            return `${context.label}: ${formatPercentage(value)} (${formatNumber(years)} years)`;
          }
        }
      }
    },
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };
  
  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Nunito',
            size: 12,
          },
          padding: 15,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatNumber(context.raw)} years`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Years',
          font: {
            family: 'Nunito',
          },
        }
      },
      y: {
        stacked: true,
      },
    }
  };
  
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Time Visualization</h2>
      
      <div className="flex border-b mb-4">
        <button
          className={`flex items-center py-2 px-4 font-medium ${
            activeTab === 'donut'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('donut')}
        >
          <PieChart size={18} className="mr-2" />
          Daily Breakdown
        </button>
        <button
          className={`flex items-center py-2 px-4 font-medium ${
            activeTab === 'bar'
              ? 'text-secondary-600 border-b-2 border-secondary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('bar')}
        >
          <BarChart2 size={18} className="mr-2" />
          Lifetime Perspective
        </button>
      </div>
      
      {/* Scrollable container for chart and content below on mobile */}
      <div className="overflow-y-auto max-h-[calc(100vh-250px)] sm:max-h-none sm:overflow-visible">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="h-64 sm:h-80"
        >
          {activeTab === 'donut' ? (
            <Doughnut data={donutData} options={donutOptions} />
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </motion.div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
            <Clock size={16} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              {formatNumber(calculation.totalYears)} years of life expectancy remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsVisualization;
