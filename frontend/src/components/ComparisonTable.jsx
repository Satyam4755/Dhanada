import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function ComparisonTable({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  // Helper to determine the best value
  const getBestIndex = (field, type = 'lowest') => {
    if (activeFunds.length < 2) return -1;
    let values = activeFunds.map(f => {
      // Handle nested fields like riskMetrics.sharpeRatio
      const keys = field.split('.');
      let val = f;
      for (const k of keys) val = val[k];
      return parseFloat(val);
    });

    // If any value is NaN or null, don't highlight
    if (values.some(isNaN)) return -1;

    let bestValue = type === 'lowest' ? Math.min(...values) : Math.max(...values);
    
    // If all values are the same, don't highlight any
    if (values.every(v => v === bestValue)) return -1;

    return values.indexOf(bestValue);
  };

  const parameters = [
    { label: 'Category', field: 'category', type: 'text' },
    { label: 'Benchmark', field: 'benchmark', type: 'text' },
    { label: 'Current NAV', field: 'nav', type: 'currency' },
    { label: 'AUM (Cr)', field: 'aum', type: 'currency' },
    { label: 'Expense Ratio', field: 'expenseRatio', type: 'lowest', suffix: '%' },
    { label: 'Standard Deviation', field: 'riskMetrics.standardDeviation', type: 'lowest' },
    { label: 'Beta (Near 1 is market neutral)', field: 'riskMetrics.beta', type: 'text' },
    { label: 'Sharpe Ratio', field: 'riskMetrics.sharpeRatio', type: 'highest' },
    { label: 'Sortino Ratio', field: 'riskMetrics.sortinoRatio', type: 'highest' },
    { label: 'Alpha', field: 'riskMetrics.alpha', type: 'highest', suffix: '%' },
    { label: 'Lock-in Period', field: 'lockIn', type: 'text' },
    { label: 'Exit Load', field: 'exitLoad', type: 'text' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 mb-12 overflow-hidden">
      <div className="p-6 lg:p-8 border-b border-[#e8edf7] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-[#1e293b] font-serif">Parameter Comparison</h2>
        <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wide">Use this table for side-by-side screening before final shortlisting.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-[#f7f9fc]">
              <th className="p-6 text-xs font-bold text-[#1e293b] uppercase tracking-wider w-1/4 sticky left-0 bg-[#f7f9fc] z-10 shadow-[1px_0_0_0_#e8edf7]">
                Parameter
              </th>
              {activeFunds.map((fund, i) => (
                <th key={i} className="p-6 text-xs font-bold text-[#032e92] uppercase tracking-wider w-1/4 border-l border-[#e8edf7]">
                  {fund.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8edf7]">
            {parameters.map((param, index) => {
              const bestIndex = (param.type === 'lowest' || param.type === 'highest') ? getBestIndex(param.field, param.type) : -1;

              return (
                <tr key={index} className="hover:bg-[#f7f9fc]/50 transition-colors">
                  <td className="p-6 text-sm font-semibold text-[#64748b] sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#e8edf7] group-hover:bg-[#f7f9fc]/50">
                    {param.label}
                    {(param.type === 'lowest' || param.type === 'highest') && (
                      <span className="block text-[10px] text-gray-400 mt-1 uppercase">({param.type} is better)</span>
                    )}
                  </td>
                  
                  {activeFunds.map((fund, i) => {
                    // Extract value
                    const keys = param.field.split('.');
                    let val = fund;
                    for (const k of keys) val = val[k];

                    const isBest = i === bestIndex;

                    return (
                      <td key={i} className={`p-6 border-l border-[#e8edf7] text-sm font-medium ${
                        isBest ? 'bg-green-50/50' : ''
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={isBest ? 'text-green-700 font-bold' : 'text-[#1e293b]'}>
                            {param.type === 'currency' && '₹ '}
                            {val !== undefined && val !== null ? val : '-'}
                            {param.suffix && val ? param.suffix : ''}
                          </span>
                          {isBest && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xs" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
