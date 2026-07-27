import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShieldAlt, faArrowUp, faBalanceScale, faWallet } from '@fortawesome/free-solid-svg-icons';

export default function AIRecommendation({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length < 2) return null;

  // Basic logic to determine the "best" funds based on simple metrics
  let bestReturn = activeFunds[0];
  let lowestRisk = activeFunds[0];
  let lowestExpense = activeFunds[0];
  let bestRiskAdjusted = activeFunds[0];

  activeFunds.forEach(fund => {
    // Highest 3Y Return (fallback to 1Y if 3Y null)
    const ret = fund.returns.threeYear || fund.returns.oneYear || 0;
    const bestRet = bestReturn.returns.threeYear || bestReturn.returns.oneYear || 0;
    if (ret > bestRet) bestReturn = fund;

    // Lowest Volatility
    if (fund.riskMetrics.standardDeviation < lowestRisk.riskMetrics.standardDeviation) lowestRisk = fund;

    // Lowest Expense
    if (fund.expenseRatio < lowestExpense.expenseRatio) lowestExpense = fund;

    // Best Sharpe
    if (fund.riskMetrics.sharpeRatio > bestRiskAdjusted.riskMetrics.sharpeRatio) bestRiskAdjusted = fund;
  });

  return (
    <div className="bg-gradient-to-r from-[#032e92] to-[#1e293b] rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-blue-900/20 mb-16 relative overflow-hidden text-white">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 text-yellow-400">
            <FontAwesomeIcon icon={faStar} className="text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-serif">Comparison Summary</h3>
            <p className="text-blue-200 text-sm font-medium">AI-generated insights based on the selected parameters.</p>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-gray-200 mb-10 max-w-4xl font-medium">
          Based on the selected parameters, <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{bestReturn.name}</strong> offers the highest historical returns, while <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{lowestRisk.name}</strong> provides lower volatility and better capital protection. If cost is your primary concern, <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{lowestExpense.name}</strong> operates with the lowest expense ratio.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="text-green-400 mb-4"><FontAwesomeIcon icon={faArrowUp} className="text-2xl" /></div>
            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Best for Growth</h4>
            <p className="font-bold text-white leading-snug">{bestReturn.name}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="text-blue-400 mb-4"><FontAwesomeIcon icon={faShieldAlt} className="text-2xl" /></div>
            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Best for Stability</h4>
            <p className="font-bold text-white leading-snug">{lowestRisk.name}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="text-yellow-400 mb-4"><FontAwesomeIcon icon={faBalanceScale} className="text-2xl" /></div>
            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Best Risk-Adjusted</h4>
            <p className="font-bold text-white leading-snug">{bestRiskAdjusted.name}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="text-purple-400 mb-4"><FontAwesomeIcon icon={faWallet} className="text-2xl" /></div>
            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Most Cost Effective</h4>
            <p className="font-bold text-white leading-snug">{lowestExpense.name}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
