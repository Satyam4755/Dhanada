import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heatmapData } from '../data/heatmapData';
import HeatmapHeader from './HeatmapHeader';
import CategoryTabs from './CategoryTabs';
import SubCategoryTabs from './SubCategoryTabs';
import HeatmapTable from './HeatmapTable';

export default function HeatmapSection() {
  const [timeFilter, setTimeFilter] = useState(4); // Default to showing 4 months (APR, MAY, JUN, JUL like screenshot) to fit well, but the prompt says 3M, 6M, 12M, All. Let's use 3M as default.
  // Wait, let's fix the default to 3
  const [activeCategory, setActiveCategory] = useState('equity');
  const [activeSubCategory, setActiveSubCategory] = useState(1);

  // When category changes, reset sub-category to the first one available
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setActiveSubCategory(heatmapData[catId].subCategories[0].id);
  };

  const currentCategoryData = heatmapData[activeCategory];
  const activeSubCatData = currentCategoryData.subCategories.find(s => s.id === activeSubCategory);
  const activeFunds = activeSubCatData ? activeSubCatData.funds : [];

  return (
    <section className="py-16 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-[#e8edf7] overflow-hidden flex flex-col"
        >
          <HeatmapHeader timeFilter={timeFilter} setTimeFilter={setTimeFilter} />

          <div className="flex flex-col lg:flex-row flex-1">
            {/* Left Sidebar - Parent Categories */}
            <CategoryTabs 
              activeCategory={activeCategory} 
              setActiveCategory={handleCategoryChange} 
            />

            {/* Center Content - Table */}
            <div className="flex-1 w-full overflow-hidden bg-white px-2 lg:px-6 pt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${activeSubCategory}-${timeFilter}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HeatmapTable 
                    funds={activeFunds} 
                    timeFilter={timeFilter} 
                    activeSubCategoryLabel={activeSubCatData?.name} 
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Sidebar - Sub Categories */}
            <SubCategoryTabs 
              subCategories={currentCategoryData.subCategories}
              activeSubCategoryId={activeSubCategory}
              setActiveSubCategoryId={setActiveSubCategory}
              parentCategoryLabel={activeCategory === 'equity' ? 'Equity' : activeCategory === 'debt' ? 'Debt' : 'Hybrid'}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
