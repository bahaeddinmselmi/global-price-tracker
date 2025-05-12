import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  chartData: ChartData;
  title: string;
  currencySymbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  chartData,
  title,
  currencySymbol
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            // Get the country code from the label
            const labelText = chartData.labels[context.dataIndex] || '';
            const isTunisia = labelText.includes('Tunisia');
            
            // Format according to country
            if (isTunisia && currencySymbol === 'د.ت') {
              return `${context.parsed.y.toLocaleString(undefined, {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
              })} ${currencySymbol}`;
            } else {
              return `${currencySymbol}${context.parsed.y.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            // Check if we're displaying Tunisian currency
            const isTunisianCurrency = currencySymbol === 'د.ت';
            
            if (isTunisianCurrency) {
              return `${value.toLocaleString()} ${currencySymbol}`;
            } else {
              return `${currencySymbol}${value.toLocaleString()}`;
            }
          }
        }
      }
    }
  };

  return (
    <div className="h-64 md:h-72 lg:h-96 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PriceChart;