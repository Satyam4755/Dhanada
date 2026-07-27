import { motion } from 'framer-motion';

export default function SubCategoryTabs({ subCategories, activeSubCategoryId, setActiveSubCategoryId, parentCategoryLabel }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-xs font-bold text-gray-800 tracking-wide px-1">
        {parentCategoryLabel} Sub-Categories
      </h3>
      <div className="flex flex-row flex-wrap gap-2">
        {subCategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubCategoryId(sub.id)}
            className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
              activeSubCategoryId === sub.id
                ? 'text-white border-transparent'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}>
            {activeSubCategoryId === sub.id && (
              <motion.div
                layoutId="activeSubCategoryBg"
                className="absolute inset-0 bg-[#032e92] rounded-full shadow-sm"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{sub.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
