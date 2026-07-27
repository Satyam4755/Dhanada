import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioComparison({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  const bgColors = ['#032e92', '#c10000', '#16A34A', '#F59E0B'];
  const borderColors = ['#ffffff', '#ffffff', '#ffffff', '#ffffff'];

  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-6">Asset Allocation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeFunds.map((fund, index) => {
          
          const labels = Object.keys(fund.allocation).map(k => k.charAt(0).toUpperCase() + k.slice(1));
          const dataVals = Object.values(fund.allocation);

          const data = {
            labels,
            datasets: [
              {
                data: dataVals,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 2,
              },
            ],
          };

          const options = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: { font: { family: 'Poppins', size: 10 }, usePointStyle: true, padding: 15 }
              },
              tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { family: 'Poppins' },
                bodyFont: { family: 'Poppins' },
                callbacks: {
                  label: function(context) {
                    return ` ${context.label}: ${context.raw}%`;
                  }
                }
              }
            }
          };

          return (
            <div key={index} className="bg-white rounded-3xl p-6 border border-[#e8edf7] shadow-lg shadow-blue-900/5">
              <h4 className="text-sm font-bold text-[#1e293b] text-center mb-6 h-10 line-clamp-2">{fund.name}</h4>
              <div className="h-48 relative">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center pb-8">
                    <span className="text-2xl font-bold text-[#032e92] block">{fund.allocation.equity || fund.allocation.debt}%</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Major</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
