import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PerformanceChart({ selectedFunds }) {
  const [timeframe, setTimeframe] = useState('1Y');
  
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  // Chart Colors (Brand matching)
  const colors = [
    { border: '#032e92', bg: 'rgba(3, 46, 146, 0.1)' },
    { border: '#c10000', bg: 'rgba(193, 0, 0, 0.1)' },
    { border: '#16A34A', bg: 'rgba(22, 163, 74, 0.1)' }
  ];

  // Dummy labels (X-axis dates)
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: activeFunds.map((fund, index) => ({
      label: fund.name,
      data: fund.historicalNAV || [], // Ensure data array matches labels length
      borderColor: colors[index % 3].border,
      backgroundColor: colors[index % 3].bg,
      tension: 0.4, // Smooth curve
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
          font: {
            family: 'Poppins',
            size: 12,
            weight: '500'
          },
          color: '#64748b'
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Poppins', size: 13 },
        bodyFont: { family: 'Poppins', size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      y: {
        grid: {
          color: '#e8edf7',
          drawBorder: false,
        },
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#94a3b8',
          callback: (value) => `₹ ${value}`
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#94a3b8'
        }
      }
    }
  };

  const tabs = ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'Since Launch'];

  return (
    <div className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 mb-12 overflow-hidden">
      <div className="p-6 lg:p-8 border-b border-[#e8edf7] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] font-serif mb-1">NAV Performance Chart</h2>
          <p className="text-[#64748b] text-sm font-medium">Compare historical NAV trends over time.</p>
        </div>
        
        {/* Timeframe Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#f7f9fc] p-1.5 rounded-xl border border-[#e8edf7]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeframe === tab 
                  ? 'bg-white text-[#032e92] shadow-sm' 
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="h-[400px] w-full">
          <Line data={data} options={options} />
        </div>
        
        <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <h4 className="text-xs font-bold text-[#1e293b] mb-1">Performance Data Disclaimer</h4>
          <p className="text-[10px] text-[#64748b] leading-relaxed">
            The daily NAV performance charts displayed are sourced from historical data. Past performance is not indicative of future results. NAV values are subject to market risks, and investors should independently verify data before making decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
