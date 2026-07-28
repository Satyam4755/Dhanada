import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioComparison({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  const bgColors = ['#032e92', '#0a4fd4', '#60a5fa', '#bfdbfe', '#e0e7ff', '#c7d2fe', '#f59e0b', '#16a34a'];
  const borderColors = Array(8).fill('#ffffff');

  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-6">Asset Allocation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeFunds.map((fund, index) => {
          const rawAlloc = fund.allocations || fund.allocation || [];
          const allocations = Array.isArray(rawAlloc) ? rawAlloc : [];

          if (!allocations || allocations.length === 0) {
            return (
              <div key={index} className="bg-white rounded-3xl p-6 border border-[#e8edf7] shadow-lg shadow-blue-900/5 flex flex-col items-center justify-center text-center min-h-[300px]">
                <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-3xl mb-3" />
                <h4 className="text-sm font-bold text-[#1e293b] mb-1 line-clamp-2">{fund.name}</h4>
                <h5 className="font-bold text-gray-900 mb-1 text-xs sm:text-sm">Asset Allocation Unavailable</h5>
                <p className="text-xs text-gray-500 max-w-xs">Asset allocation data is not available for this scheme.</p>
              </div>
            );
          }

          const labels = allocations.map(a => a.name);
          const dataVals = allocations.map(a => a.value != null ? a.value : (a.max != null ? a.max : 0));
          
          let maxVal = 0;
          let majorName = '';
          allocations.forEach(a => {
            const v = a.value != null ? a.value : (a.max != null ? a.max : 0);
            if (v > maxVal) {
              maxVal = v;
              majorName = a.name;
            }
          });

          const data = {
            labels,
            datasets: [
              {
                data: dataVals,
                backgroundColor: bgColors.slice(0, dataVals.length),
                borderColor: borderColors.slice(0, dataVals.length),
                borderWidth: 2,
              },
            ],
          };

          const options = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: {
                display: false
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
            <div key={index} className="bg-white rounded-3xl p-6 border border-[#e8edf7] shadow-lg shadow-blue-900/5 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#1e293b] text-center mb-4 h-10 line-clamp-2">{fund.name}</h4>
                
                {/* Donut Chart Container with perfectly centered text */}
                <div className="h-48 relative flex items-center justify-center">
                  <Doughnut data={data} options={options} />
                  {maxVal > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <span className="text-2xl font-extrabold text-[#032e92] block leading-none">{maxVal}%</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1 truncate max-w-[90px]">{majorName || 'Major'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Allocation Breakdown List */}
              <div className="mt-5 pt-4 border-t border-[#f1f5f9] space-y-2.5">
                {allocations.map((item, i) => {
                  const val = item.value != null ? item.value : (item.max != null ? item.max : 0);
                  const itemColor = bgColors[i % bgColors.length];
                  return (
                    <div key={i} className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2 min-w-0 flex-1">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" 
                          style={{ backgroundColor: itemColor }}
                        />
                        <span className="font-semibold text-gray-700 leading-snug break-words flex-1">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-[#1e293b]">
                          {val}%
                        </span>
                        {item.min != null && item.max != null && (item.min !== item.max) && (
                          <span className="block text-[10px] text-gray-400 font-medium">
                            ({item.min}% - {item.max}%)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
