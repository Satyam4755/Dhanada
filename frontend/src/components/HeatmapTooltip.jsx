import { motion, AnimatePresence } from 'framer-motion';

export default function HeatmapTooltip({ data, position }) {
  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 pointer-events-none bg-white rounded-xl shadow-xl shadow-blue-900/10 border border-[#e8edf7] p-3 text-sm min-w-[200px]"
        style={{
          left: position.x + 15,
          top: position.y + 15,
        }}>
        <div className="font-bold text-[#032e92] mb-1">{data.fundName}</div>
        <div className="text-xs text-gray-500 mb-2 border-b border-gray-100 pb-2">{data.category}</div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-gray-600 uppercase">Month: <span className="text-gray-900 font-bold ml-1">{data.month}</span></span>
        </div>
        <div className="flex justify-between items-center text-xs mt-1">
          <span className="font-medium text-gray-600 uppercase">Return:</span>
          <span className={`font-bold ${data.isPositive ? 'text-green-600' : data.isNegative ? 'text-red-500' : 'text-gray-400'}`}>
            {data.returnVal === "N/L" ? data.returnVal : `${data.returnVal > 0 ? '+' : ''}${data.returnVal}%`}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
