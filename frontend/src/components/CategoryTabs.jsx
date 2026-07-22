import { motion } from 'framer-motion';

const categories = [
  { id: 'equity', label: 'Equity-Oriented' },
  { id: 'debt', label: 'Debt-Oriented' },
  { id: 'hybrid', label: 'Hybrid' },
];

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  return (
    <div className="flex flex-row lg:flex-col gap-2 min-w-[220px] bg-white border-r border-[#e8edf7] p-4 overflow-x-auto lg:overflow-visible no-scrollbar">
      <h3 className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 pl-2">
        Parent Category
      </h3>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`relative px-4 py-3.5 rounded-xl text-left text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
            activeCategory === cat.id
              ? 'text-white'
              : 'text-gray-500 hover:text-[#032e92] hover:bg-[#f7f9fc]'
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
  );
}
