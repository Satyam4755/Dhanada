export default function TopHoldingsTable({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  // Aggregate holdings across all selected funds to create a master list
  const holdingsMap = {};
  
  activeFunds.forEach((fund, fundIndex) => {
    fund.holdings.forEach(holding => {
      if (!holdingsMap[holding.name]) {
        holdingsMap[holding.name] = new Array(activeFunds.length).fill(0);
      }
      holdingsMap[holding.name][fundIndex] = holding.weight;
    });
  });

  // Convert to array and sort by average weight or highest single weight
  const allHoldings = Object.entries(holdingsMap).map(([name, weights]) => ({
    name,
    weights,
    maxWeight: Math.max(...weights)
  })).sort((a, b) => b.maxWeight - a.maxWeight).slice(0, 10); // Take top 10

  return (
    <div className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 mb-12 overflow-hidden">
      <div className="p-6 lg:p-8 border-b border-[#e8edf7]">
        <h2 className="text-2xl font-bold text-[#1e293b] font-serif">Top 10 Holdings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="bg-[#f7f9fc]">
              <th className="p-4 px-6 text-xs font-bold text-[#1e293b] uppercase tracking-wider sticky left-0 bg-[#f7f9fc] z-10 shadow-[1px_0_0_0_#e8edf7]">
                Company / Asset
              </th>
              {activeFunds.map((fund, i) => (
                <th key={i} className="p-4 px-6 text-xs font-bold text-[#032e92] uppercase tracking-wider border-l border-[#e8edf7]">
                  {fund.name} Weight
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8edf7]">
            {allHoldings.map((holding, index) => (
              <tr key={index} className="hover:bg-[#f7f9fc]/50 transition-colors group">
                <td className="p-4 px-6 text-sm font-bold text-[#1e293b] sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#e8edf7] group-hover:bg-[#f7f9fc]/50">
                  {holding.name}
                </td>
                {holding.weights.map((weight, i) => (
                  <td key={i} className="p-4 px-6 border-l border-[#e8edf7]">
                    {weight > 0 ? (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#64748b] w-8">{weight}%</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#032e92] to-[#c10000] rounded-full"
                            style={{ width: `${(weight / 15) * 100}%` }} // Relative to a max reasonable weight (15%)
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-gray-300">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
