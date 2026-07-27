import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function ReturnsCards({ selectedFunds }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const activeFunds = selectedFunds.filter(f => f !== null);
  
  if (activeFunds.length === 0) return null;

  const periods = [
    { label: '1 Year Return', key: 'oneYear' },
    { label: '3 Year CAGR', key: 'threeYear' },
    { label: '5 Year CAGR', key: 'fiveYear' },
    { label: 'Since Launch', key: 'sinceLaunch' }
  ];

  const colors = ['#032e92', '#c10000', '#16A34A'];

  return (
    <div className="mb-12" ref={ref}>
      <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-6">Returns Comparison</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {periods.map((period, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 border border-[#e8edf7] shadow-lg shadow-blue-900/5 group hover:border-[#032e92]/30 transition-colors">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 pb-4 border-b border-[#e8edf7] group-hover:border-[#032e92]/20 transition-colors">
              {period.label}
            </h4>
            
            <div className="space-y-4">
              {activeFunds.map((fund, i) => {
                const value = fund.returns && fund.returns[period.key];
                const hasValue = value !== null && value !== undefined;
                const isPositive = hasValue && value > 0;
                
                return (
                  <div key={i} className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 mb-1 truncate" style={{ color: colors[i % 3] }}>
                      {fund.name.substring(0, 30)}...
                    </span>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-[#1e293b]">
                        {hasValue ? (
                          <>{value}%</>
                        ) : (
                          <span className="text-gray-300">N/A</span>
                        )}
                      </div>
                      {hasValue && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                          isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <FontAwesomeIcon icon={isPositive ? faArrowUp : faArrowDown} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
