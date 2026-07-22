import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeatmapTooltip from './HeatmapTooltip';

const monthsAll = ['apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar'];

const getColor = (val) => {
  if (val === 'N/L' || val === undefined || val === null) return 'bg-gray-100 text-transparent bg-[url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZjFmNWY5Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wLDggTDgsMCBMMCwwIFoiIGZpbGw9IiNlMmU4ZjAiPjwvcGF0aD4KPHBhdGggZD0iTTgsOCBMOCwwIE0wLDggTzAsOCBaIiBmaWxsPSIjZTJlOGYwIj48L3BhdGg+Cjwvc3ZnPg==\')] text-gray-300 font-normal';
  if (val >= 4) return 'bg-[#064e3b] text-white'; // Darker Green
  if (val >= 2) return 'bg-[#10b981] text-white'; // Green
  if (val > 0) return 'bg-[#a7f3d0] text-gray-700'; // Light Green
  if (val === 0) return 'bg-gray-200 text-gray-700'; // Gray
  if (val > -2) return 'bg-[#fca5a5] text-red-900'; // Light Red
  if (val > -4) return 'bg-[#ef4444] text-white'; // Red
  return 'bg-[#7f1d1d] text-white'; // Dark Red
};

export default function HeatmapTable({ funds, timeFilter, activeSubCategoryLabel }) {
  const [tooltipData, setTooltipData] = useState(null);
  
  // Handle mouse move for tooltip
  const handleMouseMove = (e, fund, month, returnVal) => {
    setTooltipData({
      x: e.clientX,
      y: e.clientY,
      fundName: fund.name,
      category: activeSubCategoryLabel,
      month: month.toUpperCase() + " '26", // Mock year
      returnVal,
      isPositive: returnVal > 0 && returnVal !== 'N/L',
      isNegative: returnVal < 0 && returnVal !== 'N/L',
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  // Determine months to show based on timeFilter
  let displayMonths = monthsAll;
  if (timeFilter !== 'all') {
    // Show the first N months for demonstration purposes
    displayMonths = monthsAll.slice(0, timeFilter);
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
              {displayMonths.map((m) => (
                <th key={m} className="py-4 px-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-[#e8edf7] min-w-[90px]">
                  {m} '26
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
                      <p className="font-bold text-sm text-gray-900 truncate max-w-[160px]">{fund.name}</p>
                      <p className="text-xs text-gray-400 font-medium truncate max-w-[160px]">{fund.amc}</p>
                    </div>
                  </div>
                </td>
                {displayMonths.map((m) => {
                  const val = fund.monthlyReturns[m];
                  return (
                    <td key={m} className="p-0.5">
                      <motion.div
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        onMouseMove={(e) => handleMouseMove(e, fund, m, val)}
                        onMouseLeave={handleMouseLeave}
                        className={`w-full h-12 rounded-lg flex items-center justify-center font-bold text-[11px] lg:text-xs cursor-pointer shadow-sm transition-shadow hover:shadow-md border border-black/5 ${getColor(val)}`}
                      >
                        {val === 'N/L' ? 'N/L' : `${val > 0 ? '+' : ''}${val}%`}
                      </motion.div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
            {funds.length === 0 && (
              <tr>
                <td colSpan={displayMonths.length + 1} className="py-12 text-center text-gray-500 font-medium">
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
