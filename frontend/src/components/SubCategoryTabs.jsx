import { motion } from 'framer-motion';

export default function SubCategoryTabs({ subCategories, activeSubCategoryId, setActiveSubCategoryId, parentCategoryLabel }) {
  return (
    <div className="flex flex-row lg:flex-col gap-2 min-w-[260px] bg-white border-l border-[#e8edf7] p-4 overflow-x-auto lg:overflow-visible no-scrollbar">
      <h3 className="hidden lg:block text-xs font-bold text-gray-800 tracking-wide mb-3 pl-2">
        {parentCategoryLabel} Sub-Categories
      </h3>
      {subCategories.map((sub) => (
        <button
          key={sub.id}
          onClick={() => setActiveSubCategoryId(sub.id)}
          className={`relative px-4 py-3.5 rounded-xl text-left text-xs font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
            activeSubCategoryId === sub.id
              ? 'text-white'
              : 'text-gray-500 hover:text-[#032e92] hover:bg-[#f7f9fc]'
          }`}>
          {activeSubCategoryId === sub.id && (
            <motion.div
              layoutId="activeSubCategoryBg"
              className="absolute inset-0 bg-[#032e92] rounded-xl shadow-md shadow-blue-900/20"
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{sub.name}</span>
        </button>
      ))}
    </div>
  );
}
