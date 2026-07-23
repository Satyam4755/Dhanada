import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faChevronDown, faSliders, faRotateLeft,
  faArrowUpWideShort
} from '@fortawesome/free-solid-svg-icons'

const minInvestments = ['All', '₹500', '₹1,000', '₹5,000', '₹10,000', '₹50,000']
const sortOptions = [
  { label: 'AUM', value: 'aum' },
  { label: 'Returns', value: 'returns' },
  { label: 'Risk', value: 'risk' },
  { label: 'A–Z', value: 'alpha' },
  { label: 'Newest', value: 'newest' },
]

function SelectDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
          value && value !== 'All'
            ? 'border-[#032e92] bg-[#eef4ff] text-[#032e92]'
            : 'border-[#e8edf7] bg-white text-gray-600 hover:border-[#032e92]/40'
        }`}>
        <span className="truncate">{value || label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 mt-1 w-full z-30 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-[#e8edf7] py-2 max-h-52 overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === opt
                    ? 'bg-[#eef4ff] text-[#032e92] font-semibold'
                    : 'text-gray-600 hover:bg-[#f7f9fc] hover:text-[#032e92]'
                }`}>
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FundFilters({ filters, setFilters, onClear, amcList = [], fundsData = [] }) {
  const handleChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val === 'All' ? '' : val }))
  }

  const dynamicAssetClasses = ['All', ...new Set(fundsData.map(f => f.assetClass).filter(Boolean))].sort();
  const dynamicCategories = ['All', ...new Set(fundsData.map(f => f.category).filter(Boolean))].sort();
  const dynamicRiskLevels = useMemo(() => {
    const risks = new Set()
    fundsData.forEach(f => {
      if (f.riskLevel !== 'N/A') {
        risks.add(f.riskLevel)
      }
    })
    return ['All', ...Array.from(risks).sort().map(r => `Risk Level ${r}`)]
  }, [fundsData])

  return (
    <section className="bg-[#f7f9fc] pb-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg shadow-blue-900/5 border border-[#e8edf7] p-6 lg:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#eef4ff] flex items-center justify-center">
                <FontAwesomeIcon icon={faSliders} className="text-[#032e92] text-sm" />
              </div>
              <span className="font-bold text-gray-800">Filter Funds</span>
            </div>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#c10000] hover:text-[#9d0000] transition-colors">
              <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
              Clear Filters
            </button>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Asset Class</label>
              <SelectDropdown
                label="All Classes"
                value={filters.assetClass || 'All'}
                options={dynamicAssetClasses}
                onChange={v => handleChange('assetClass', v)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Category</label>
              <SelectDropdown
                label="All Categories"
                value={filters.category || 'All'}
                options={dynamicCategories}
                onChange={v => handleChange('category', v)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Risk Level</label>
              <SelectDropdown
                label="All Risks"
                value={filters.risk || 'All'}
                options={dynamicRiskLevels}
                onChange={v => handleChange('risk', v)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">AMC</label>
              <SelectDropdown
                label="All AMCs"
                value={filters.amc || 'All'}
                options={['All', ...amcList]}
                onChange={v => handleChange('amc', v)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Min. Investment</label>
              <SelectDropdown
                label="Any Amount"
                value={filters.minInvestment || 'All'}
                options={minInvestments}
                onChange={v => handleChange('minInvestment', v)} />
            </div>
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Search</label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search Fund..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e8edf7] text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-[#032e92]/10 transition-all" />
              </div>
            </div>
          </div>

          {/* Sort Pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <FontAwesomeIcon icon={faArrowUpWideShort} className="text-sm" />
              Sort By:
            </div>
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilters(prev => ({ ...prev, sort: opt.value }))}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filters.sort === opt.value
                    ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                    : 'bg-[#f7f9fc] text-gray-600 border border-[#e8edf7] hover:border-[#032e92]/40 hover:text-[#032e92]'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
