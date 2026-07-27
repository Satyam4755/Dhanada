import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SectorAllocation({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  // Extract all unique sectors across selected funds
  const allSectors = new Set();
  activeFunds.forEach(fund => {
    Object.keys(fund.sectors).forEach(sector => allSectors.add(sector));
  });
  
  const labels = Array.from(allSectors);

  const colors = [
    { bg: 'rgba(3, 46, 146, 0.8)', hover: 'rgba(3, 46, 146, 1)' },
    { bg: 'rgba(193, 0, 0, 0.8)', hover: 'rgba(193, 0, 0, 1)' },
    { bg: 'rgba(22, 163, 74, 0.8)', hover: 'rgba(22, 163, 74, 1)' }
  ];

  const data = {
    labels,
    datasets: activeFunds.map((fund, index) => ({
      label: fund.name,
      data: labels.map(sector => fund.sectors[sector] || 0),
      backgroundColor: colors[index % 3].bg,
      hoverBackgroundColor: colors[index % 3].hover,
      borderRadius: 4,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal bar chart
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: 'Poppins', size: 11 }, usePointStyle: true, padding: 20 }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Poppins' },
        bodyFont: { family: 'Poppins' },
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.raw}%`
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#e8edf7' },
        ticks: { font: { family: 'Poppins', size: 10 }, color: '#94a3b8', callback: (value) => `${value}%` }
      },
      y: {
        grid: { display: false },
        ticks: { font: { family: 'Poppins', size: 11, weight: '500' }, color: '#1e293b' }
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 mb-12 p-6 lg:p-8">
      <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-6">Sector Allocation</h3>
      <div className="h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
