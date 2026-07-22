import { useState } from 'react';
import { motion } from 'framer-motion';
import HeatmapTooltip from './HeatmapTooltip';

const allPeriods = [
  { key: 'returns1W', label: '1W' },
  { key: 'returns1M', label: '1M' },
  { key: 'returns3M', label: '3M' },
  { key: 'returns6M', label: '6M' },
  { key: 'returnsYTD', label: 'YTD' },
  { key: 'returns1Y', label: '1Y' },
  { key: 'returns3Y', label: '3Y' },
  { key: 'returns5Y', label: '5Y' },
];

const getColor = (val) => {
  if (val === undefined || val === null || val === 'N/A') return 'bg-gray-100 text-gray-400 font-medium';
  const num = parseFloat(val);
  if (isNaN(num)) return 'bg-gray-100 text-gray-400 font-medium';
  
  if (num >= 4) return 'bg-[#064e3b] text-white shadow-inner'; // Darker Green
  if (num >= 2) return 'bg-[#10b981] text-white'; // Green
  if (num > 0) return 'bg-[#a7f3d0] text-gray-800'; // Light Green
  if (num === 0) return 'bg-gray-200 text-gray-700'; // Gray
  if (num > -2) return 'bg-[#fca5a5] text-red-900'; // Light Red
  if (num > -4) return 'bg-[#ef4444] text-white'; // Red
  return 'bg-[#7f1d1d] text-white shadow-inner'; // Dark Red
};

export default function HeatmapTable({ funds, timeFilter, activeSubCategoryLabel }) {
  const [tooltipData, setTooltipData] = useState(null);
  
  // Handle mouse move for tooltip
  const handleMouseMove = (e, fund, periodLabel, returnVal) => {
    setTooltipData({
      x: e.clientX,
      y: e.clientY,
      fundName: fund.name,
      category: activeSubCategoryLabel,
      month: periodLabel + ' Return', // Mocking the tooltip label prop
      returnVal: returnVal != null ? returnVal : 'N/A',
      isPositive: returnVal > 0,
      isNegative: returnVal < 0,
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  // Determine periods to show based on timeFilter
  let displayPeriods = allPeriods;
  if (timeFilter === 'Short Term') {
    displayPeriods = allPeriods.slice(0, 5); // 1W to YTD
  } else if (timeFilter === 'Long Term') {
    displayPeriods = allPeriods.slice(5); // 1Y to 5Y
  }

  return (
    <div className="flex-1 w-full bg-white relative">
      <div className="overflow-x-auto w-full no-scrollbar pb-4 border-b border-[#e8edf7]">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white z-20 py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-[#e8edf7] min-w-[200px]">
                Fund Name
              </th>
              {displayPeriods.map((p) => (
                <th key={p.key} className="py-4 px-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-[#e8edf7] min-w-[90px]">
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {funds.map((fund, index) => (
              <motion.tr 
                key={fund.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group border-b border-[#e8edf7] last:border-0 hover:bg-[#f7f9fc] transition-colors"
              >
                <td className="sticky left-0 bg-white group-hover:bg-[#f7f9fc] z-10 py-3 px-4 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#eef4ff] text-[#032e92] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {fund.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 truncate max-w-[160px]" title={fund.name}>{fund.name}</p>
                      <p className="text-xs text-gray-400 font-medium truncate max-w-[160px]">{fund.amc}</p>
                    </div>
                  </div>
                </td>
                {displayPeriods.map((p) => {
                  const val = fund[p.key];
                  return (
                    <td key={p.key} className="p-0.5">
                      <motion.div
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        onMouseMove={(e) => handleMouseMove(e, fund, p.label, val)}
                        onMouseLeave={handleMouseLeave}
                        className={`w-full h-12 rounded-lg flex items-center justify-center font-bold text-[11px] lg:text-xs cursor-pointer shadow-sm transition-shadow hover:shadow-md border border-black/5 ${getColor(val)}`}
                      >
                        {val == null ? 'N/A' : `${val > 0 ? '+' : ''}${val}%`}
                      </motion.div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
            {funds.length === 0 && (
              <tr>
                <td colSpan={displayPeriods.length + 1} className="py-12 text-center text-gray-500 font-medium">
                  No funds available in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {tooltipData && <HeatmapTooltip data={tooltipData} position={{ x: tooltipData.x, y: tooltipData.y }} />}
    </div>
  );
}
