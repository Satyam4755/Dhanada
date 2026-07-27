import { motion } from 'framer-motion';

export default function RiskComparison({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  const colors = [
    { border: '#032e92', bg: '#032e92', track: 'rgba(3, 46, 146, 0.1)' },
    { border: '#c10000', bg: '#c10000', track: 'rgba(193, 0, 0, 0.1)' },
    { border: '#16A34A', bg: '#16A34A', track: 'rgba(22, 163, 74, 0.1)' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 mb-12 p-6 lg:p-8">
      <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-2">Risk Profile Comparison</h3>
      <p className="text-[#64748b] text-sm mb-8 font-medium">Compare the overall risk band and risk level associated with each fund.</p>
      
      <div className="space-y-4">
        {activeFunds.map((fund, index) => {
          const color = colors[index % 3];
          const riskLevel = fund.riskNumeric || 3;
          const riskLabel = fund.risk || `Level ${riskLevel}`;
          
          // Calculate percentage for progress bar (Scale 1-5 maps to 20% - 100%)
          const progressPercentage = (riskLevel / 5) * 100;

          return (
            <div key={index} className="bg-[#f7f9fc] rounded-xl p-4 border border-[#e8edf7]">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h4 className="text-sm lg:text-base font-bold text-[#1e293b] flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.bg }} />
                  {fund.name}
                </h4>
                <div className="inline-flex items-center gap-1.5 bg-white border border-[#e8edf7] px-2 py-1 rounded-lg shadow-sm">
                  <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">Risk Band:</span>
                  <span className="text-xs font-bold" style={{ color: color.bg }}>{riskLabel}</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative pt-1">
                {/* Track */}
                <div 
                  className="w-full h-2 rounded-full overflow-hidden relative" 
                  style={{ backgroundColor: color.track }}
                >
                  {/* Fill */}
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color.bg }}
                  />
                </div>
                
                {/* Scale markers */}
                <div className="flex justify-between text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mt-2 px-1">
                  <span>Level 1</span>
                  <span>Level 2</span>
                  <span>Level 3</span>
                  <span>Level 4</span>
                  <span>Level 5</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TODO: Re-enable detailed quantitative risk metrics (Alpha, Beta, Sharpe, Volatility) here once available from Frappe API. */}
    </div>
  );
}
