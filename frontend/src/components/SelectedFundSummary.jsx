import { motion } from 'framer-motion';

export default function SelectedFundSummary({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);

  if (activeFunds.length === 0) return null;

  return (
    <div className="mb-12">
      <div className={`grid gap-6 ${
        activeFunds.length === 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
        activeFunds.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
        'grid-cols-1 md:grid-cols-3'
      }`}>
        {activeFunds.map((fund, index) => (
          <motion.div
            key={`${fund.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-[#e8edf7] shadow-lg shadow-blue-900/5 hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full"
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#1e293b] leading-snug mb-1">{fund.name}</h3>
              <p className="text-[#64748b] text-xs font-semibold mb-6 uppercase tracking-wide">{fund.category}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#f7f9fc] rounded-xl p-3 border border-[#e8edf7]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">NAV</p>
                  <p className="text-base font-bold text-[#1e293b]">₹ {fund.nav}</p>
                </div>
                <div className="bg-[#f7f9fc] rounded-xl p-3 border border-[#e8edf7]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">AUM</p>
                  <p className="text-base font-bold text-[#1e293b]">{fund.aum} Cr</p>
                </div>
                <div className="bg-[#f7f9fc] rounded-xl p-3 border border-[#e8edf7]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Expense</p>
                  <p className="text-base font-bold text-[#1e293b]">{fund.expenseRatio}%</p>
                </div>
                <div className="bg-[#f7f9fc] rounded-xl p-3 border border-[#e8edf7]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sharpe</p>
                  <p className="text-base font-bold text-[#1e293b]">{fund.riskMetrics.sharpeRatio}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-[#e8edf7] flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                fund.risk === 'Low' ? 'bg-green-100 text-green-700' :
                fund.risk === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                fund.risk === 'High' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {fund.risk}
              </span>
              <button className="text-[#032e92] text-sm font-bold hover:text-[#c10000] transition-colors">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
