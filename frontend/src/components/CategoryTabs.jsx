import { motion } from 'framer-motion';

export default function CategoryTabs({ categories = [], activeCategory, setActiveCategory }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">
        Asset Class
      </h3>
      <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`relative px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
              activeCategory === cat.id
                ? 'text-white'
                : 'text-gray-500 hover:text-[#032e92] hover:bg-[#f7f9fc] border border-transparent hover:border-[#e8edf7]'
            }`}>
            {activeCategory === cat.id && (
              <motion.div
                layoutId="activeCategoryBg"
                className="absolute inset-0 bg-[#032e92] rounded-xl shadow-md shadow-blue-900/20"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
