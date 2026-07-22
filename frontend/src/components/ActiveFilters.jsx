import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const riskColors = {
  'Low': 'bg-green-100 text-green-700 border-green-200',
  'Moderate': 'bg-amber-100 text-amber-700 border-amber-200',
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Very High': 'bg-red-200 text-red-800 border-red-300',
}

export default function ActiveFilters({ filters, setFilters }) {
  const activeItems = [
    filters.assetClass && { key: 'assetClass', label: filters.assetClass },
    filters.category && { key: 'category', label: filters.category },
    filters.risk && { key: 'risk', label: `${filters.risk} Risk`, style: riskColors[filters.risk] },
    filters.amc && { key: 'amc', label: filters.amc },
    filters.minInvestment && { key: 'minInvestment', label: `Min: ${filters.minInvestment}` },
    filters.search && { key: 'search', label: `"${filters.search}"` },
  ].filter(Boolean)

  if (!activeItems.length) return null

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }))
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Active:</span>
        <AnimatePresence>
          {activeItems.map(item => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => removeFilter(item.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:shadow-md ${
                item.style || 'bg-[#eef4ff] text-[#032e92] border-[#032e92]/20'
              }`}>
              {item.label}
              <FontAwesomeIcon icon={faCircleXmark} className="text-xs opacity-70 hover:opacity-100" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
