import { motion } from 'framer-motion';

export default function HeatmapHeader({ timeFilter, setTimeFilter }) {
  const tabs = [
    { label: '3M', value: 3 },
    { label: '6M', value: 6 },
    { label: '12M', value: 12 },
    { label: 'All', value: 'all' },
  ];

  return (
    <div className="bg-[#032e92] text-white rounded-t-3xl p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl lg:text-3xl font-bold mb-2 font-serif">
          Monthly Returns Heatmap
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-blue-100 text-sm max-w-2xl">
          Compare monthly returns of SIF funds across different categories and identify the best-performing funds.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex p-1 bg-white/10 rounded-xl border border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTimeFilter(tab.value)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              timeFilter === tab.value
                ? 'bg-white text-[#032e92] shadow-md'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}>
            {tab.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
