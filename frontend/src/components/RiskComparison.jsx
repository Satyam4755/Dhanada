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
    <div className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 mb-8 p-5 lg:p-6">
      <h3 className="text-lg lg:text-xl font-bold text-[#1e293b] font-serif mb-1">Risk Profile Comparison</h3>
      <p className="text-[#64748b] text-xs sm:text-sm mb-5 font-medium">Compare the overall risk band and risk level associated with each fund.</p>
      
      <div className="space-y-3.5">
        {activeFunds.map((fund, index) => {
          const color = colors[index % 3];
          const hasRisk = fund.riskNumeric != null && fund.riskNumeric >= 1 && fund.riskNumeric <= 5 && fund.risk !== 'N/A';
          const riskLevel = hasRisk ? fund.riskNumeric : null;
          const riskLabel = hasRisk ? (fund.risk || `Level ${riskLevel}`) : 'N/A';
          
          // Calculate percentage for progress bar: Level 1 = 20%, Level 2 = 40%, Level 3 = 60%, Level 4 = 80%, Level 5 = 100%
          const progressPercentage = hasRisk ? (riskLevel / 5) * 100 : 0;

          return (
            <div key={index} className="bg-[#f7f9fc] rounded-xl p-3.5 sm:p-4 border border-[#e8edf7]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#1e293b] flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: hasRisk ? color.bg : '#94a3b8' }} />
                  <span>{fund.name}</span>
                </h4>
                <div className="inline-flex items-center gap-1.5 bg-white border border-[#e8edf7] px-2.5 py-0.5 rounded-lg shadow-sm">
                  <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">Risk Band:</span>
                  <span className="text-xs font-bold" style={{ color: hasRisk ? color.bg : '#64748b' }}>{riskLabel}</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative pt-1">
                {/* Track (8-10px height: h-2.5 = 10px). Muted track when N/A */}
                <div 
                  className="w-full h-2.5 rounded-full overflow-hidden relative" 
                  style={{ backgroundColor: hasRisk ? color.track : '#e2e8f0' }}
                >
                  {/* Fill - only rendered when valid risk level exists */}
                  {hasRisk && (
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progressPercentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color.bg }}
                    />
                  )}
                </div>
                
                {/* Scale markers */}
                <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mt-1 px-0.5">
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
