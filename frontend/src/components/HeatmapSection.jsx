import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeatmapHeader from './HeatmapHeader';
import CategoryTabs from './CategoryTabs';
import SubCategoryTabs from './SubCategoryTabs';
import HeatmapTable from './HeatmapTable';

export default function HeatmapSection({ fundsData = [] }) {
  const [timeFilter, setTimeFilter] = useState('All'); 
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState('');

  // Process live fundsData into a hierarchical structure
  const groupedData = useMemo(() => {
    const dataMap = {};
    fundsData.forEach(fund => {
      // Use assetClass as parent, category as sub-category
      // Skip funds without proper taxonomy
      if (!fund.assetClass || !fund.category) return;
      
      const ac = fund.assetClass;
      const cat = fund.category;

      if (!dataMap[ac]) {
        dataMap[ac] = { id: ac, label: ac, subCategories: {} };
      }
      if (!dataMap[ac].subCategories[cat]) {
        dataMap[ac].subCategories[cat] = { id: cat, name: cat, funds: [] };
      }
      dataMap[ac].subCategories[cat].funds.push(fund);
    });

    // Convert to sorted arrays
    const finalData = Object.values(dataMap).sort((a, b) => a.label.localeCompare(b.label));
    finalData.forEach(ac => {
      ac.subCategories = Object.values(ac.subCategories).sort((a, b) => a.name.localeCompare(b.name));
    });

    return finalData;
  }, [fundsData]);

  // Set default active tabs when data loads
  useEffect(() => {
    if (groupedData.length > 0) {
      if (!activeCategory || !groupedData.find(g => g.id === activeCategory)) {
        const defaultCat = groupedData[0];
        setActiveCategory(defaultCat.id);
        if (defaultCat.subCategories.length > 0) {
          setActiveSubCategory(defaultCat.subCategories[0].id);
        }
      }
    }
  }, [groupedData, activeCategory]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    const catData = groupedData.find(g => g.id === catId);
    if (catData && catData.subCategories.length > 0) {
      setActiveSubCategory(catData.subCategories[0].id);
    } else {
      setActiveSubCategory('');
    }
  };

  const currentCategoryData = groupedData.find(g => g.id === activeCategory);
  const activeSubCatData = currentCategoryData?.subCategories.find(s => s.id === activeSubCategory);
  const activeFunds = activeSubCatData ? activeSubCatData.funds : [];

  if (groupedData.length === 0) return null; // Don't render if no data

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
              categories={groupedData.map(g => ({ id: g.id, label: g.label }))}
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
            {currentCategoryData && currentCategoryData.subCategories.length > 0 && (
              <SubCategoryTabs 
                subCategories={currentCategoryData.subCategories}
                activeSubCategoryId={activeSubCategory}
                setActiveSubCategoryId={setActiveSubCategory}
                parentCategoryLabel={currentCategoryData.label}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
