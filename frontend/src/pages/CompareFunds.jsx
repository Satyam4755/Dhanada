import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCircleExclamation, faPlus, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PlanSelector from '../components/PlanSelector'
import { fetchFundDetails, fetchFundsList } from '../api/funds'

function formatCurrency(val) {
  if (val == null || val === 'N/A') return 'N/A'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val)
}

function formatPct(val) {
  if (val == null || val === 'N/A') return 'N/A'
  return `${Number(val).toFixed(2)}%`
}

function formatDate(val) {
  if (!val) return 'N/A'
  return new Date(val).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Custom hook to manage plan state per fund
function useFundPlan(apiFund) {
  const plans = apiFund?.plans || []
  
  // Available options
  const availableTypes = useMemo(() => [...new Set(plans.map(p => p.type).filter(Boolean))], [plans])
  
  const [selectedType, setSelectedType] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedSubOption, setSelectedSubOption] = useState('')

  // Initialize with default plan
  useEffect(() => {
    if (apiFund?.defaultPlan) {
      setSelectedType(apiFund.defaultPlan.type || '')
      setSelectedOption(apiFund.defaultPlan.option || '')
      setSelectedSubOption(apiFund.defaultPlan.sub_option || '')
    } else if (plans.length > 0) {
      setSelectedType(plans[0].type || '')
      setSelectedOption(plans[0].option || '')
      setSelectedSubOption(plans[0].sub_option || '')
    }
  }, [apiFund, plans])

  const availableOptions = useMemo(() => {
    return [...new Set(plans.filter(p => p.type === selectedType).map(p => p.option).filter(Boolean))]
  }, [plans, selectedType])

  useEffect(() => {
    if (selectedOption && !availableOptions.includes(selectedOption) && availableOptions.length > 0) {
      setSelectedOption(availableOptions[0])
    }
  }, [availableOptions, selectedOption])

  const availableSubOptions = useMemo(() => {
    return [...new Set(plans.filter(p => p.type === selectedType && p.option === selectedOption).map(p => p.sub_option).filter(Boolean))]
  }, [plans, selectedType, selectedOption])

  useEffect(() => {
    if (selectedSubOption && !availableSubOptions.includes(selectedSubOption) && availableSubOptions.length > 0) {
      setSelectedSubOption(availableSubOptions[0])
    } else if (!availableSubOptions.includes(selectedSubOption)) {
      setSelectedSubOption('')
    }
  }, [availableSubOptions, selectedSubOption])

  const selectedPlan = useMemo(() => {
    return plans.find(p => 
      p.type === selectedType && 
      p.option === selectedOption && 
      (p.sub_option || '') === (selectedSubOption || '')
    ) || plans[0]
  }, [plans, selectedType, selectedOption, selectedSubOption])

  // Processed fund wrapper
  const fund = useMemo(() => {
    if (!apiFund) return null
    
    return {
      ...apiFund,
      nav: selectedPlan?.nav ? formatCurrency(selectedPlan.nav) : 'N/A',
      navDate: formatDate(selectedPlan?.nav_date),
      returns1M: formatPct(selectedPlan?.performance_data?.['1_month']),
      returns3M: formatPct(selectedPlan?.performance_data?.['3_months']),
      returns6M: formatPct(selectedPlan?.performance_data?.['6_months']),
      returns1Y: formatPct(selectedPlan?.performance_data?.['1_year']),
      returns3Y: formatPct(selectedPlan?.performance_data?.['3_years']),
      returns5Y: formatPct(selectedPlan?.performance_data?.['5_years']),
      returnsLaunch: formatPct(selectedPlan?.performance_data?.['since_inception']),
      isin: selectedPlan?.isin,
      sifCode: selectedPlan?.sif_code,
    }
  }, [apiFund, selectedPlan])

  return {
    fund,
    planSelectorProps: {
      availableTypes, availableOptions, availableSubOptions, availablePeriods: [],
      selectedType, selectedOption, selectedSubOption, selectedPeriod: '',
      setSelectedType, setSelectedOption, setSelectedSubOption, setSelectedPeriod: () => {},
      fund
    }
  }
}

function CompareColumn({ id, onRemove, allFundsList, category }) {
  const [apiFund, setApiFund] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(!id)
  
  // Available funds to pick from (same category)
  const availableFunds = useMemo(() => {
    return allFundsList.filter(f => f.category === category)
  }, [allFundsList, category])

  useEffect(() => {
    if (id) {
      setLoading(true)
      setIsEditing(false)
      fetchFundDetails(id)
        .then(data => {
          setApiFund(data)
          setError(null)
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    } else {
      setApiFund(null)
      setIsEditing(true)
    }
  }, [id])

  const { fund, planSelectorProps } = useFundPlan(apiFund)

  if (loading) {
    return (
      <div className="flex-1 border border-[#e8edf7] rounded-3xl bg-white p-8 flex flex-col items-center justify-center min-h-[500px]">
        <FontAwesomeIcon icon={faSpinner} className="text-3xl text-[#032e92] animate-spin mb-4" />
        <p className="text-gray-500 font-semibold text-sm">Loading fund...</p>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="flex-1 border-2 border-dashed border-[#e8edf7] rounded-3xl bg-gray-50/50 p-8 flex flex-col items-center justify-center min-h-[500px] relative">
        {onRemove && (
          <button onClick={onRemove} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center shadow-sm">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        <div className="w-16 h-16 rounded-full bg-[#eef4ff] flex items-center justify-center mb-6">
          <FontAwesomeIcon icon={faPlus} className="text-[#032e92] text-xl" />
        </div>
        <h3 className="font-bold text-gray-900 mb-2">Add Fund to Compare</h3>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-[250px]">
          Select another {category || ''} fund to compare side-by-side.
        </p>
        
        <select 
          className="w-full max-w-[280px] bg-white border border-[#e8edf7] text-gray-700 text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:border-[#032e92] shadow-sm appearance-none cursor-pointer"
          onChange={(e) => {
            if (e.target.value) {
              window.location.search += (window.location.search ? '&' : '?') + 'compare=' + e.target.value
            }
          }}
          defaultValue="">
          <option value="" disabled>Select a fund...</option>
          {availableFunds.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>
    )
  }

  if (error || !fund) {
    return (
      <div className="flex-1 border border-red-100 rounded-3xl bg-red-50 p-8 flex flex-col items-center justify-center min-h-[500px] relative">
        {onRemove && (
          <button onClick={onRemove} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-red-200 text-red-400 hover:text-red-600 transition-all flex items-center justify-center shadow-sm">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        <FontAwesomeIcon icon={faCircleExclamation} className="text-3xl text-red-400 mb-4" />
        <p className="text-red-600 font-semibold text-sm text-center">Failed to load fund</p>
      </div>
    )
  }

  const renderRow = (label, value, isBold = false) => (
    <div className="py-4 border-b border-[#e8edf7] flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className={`text-sm ${isBold ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{value || 'N/A'}</span>
    </div>
  )

  return (
    <div className="flex-1 border border-[#e8edf7] rounded-3xl bg-white shadow-xl shadow-blue-900/5 relative overflow-hidden flex flex-col min-w-[320px]">
      {onRemove && (
        <button onClick={onRemove} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center shadow-sm">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
      
      {/* Header */}
      <div className="p-6 bg-[#f7f9fc] border-b border-[#e8edf7]">
        <h2 className="text-lg font-bold text-gray-900 leading-tight mb-2 pr-8">{fund.name}</h2>
        <p className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 inline-block px-2.5 py-1 rounded-lg">{fund.amc}</p>
      </div>

      {/* Plan Selector */}
      <div className="p-4 border-b border-[#e8edf7] bg-white">
        <PlanSelector {...planSelectorProps} className="!border-none !shadow-none !p-0 !gap-2 flex-col items-start [&>div:first-child]:hidden [&>div:last-child]:mt-2 [&>div:last-child]:text-left [&>div:last-child]:w-full [&>select]:w-full" />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 bg-white">
        {renderRow('Category', fund.category, true)}
        {renderRow('Asset Class', fund.assetClass)}
        {renderRow('Risk', `${fund.risk || 'N/A'} Risk`, true)}
        {renderRow('Current NAV', `${fund.nav} (${fund.navDate})`, true)}
        {renderRow('1 Month Return', fund.returns1M)}
        {renderRow('3 Month Return', fund.returns3M)}
        {renderRow('6 Month Return', fund.returns6M)}
        {renderRow('1 Year Return', fund.returns1Y, true)}
        {renderRow('3 Year Return', fund.returns3Y, true)}
        {renderRow('5 Year Return', fund.returns5Y, true)}
        {renderRow('Since Launch', fund.returnsLaunch)}
        {renderRow('Min Investment', fund.minInvestmentText || (fund.minInvestment ? formatCurrency(fund.minInvestment) : 'N/A'))}
        {renderRow('Launch Date', formatDate(fund.launchDate))}
        {renderRow('Benchmark', fund.benchmarkTier1)}
      </div>
      
      {/* Footer Action */}
      <div className="p-6 bg-gray-50 border-t border-[#e8edf7]">
        <Link to={`/funds/${encodeURIComponent(fund.id)}`} className="block w-full py-3 rounded-2xl bg-[#032e92] text-white font-bold text-sm text-center hover:bg-[#021d63] shadow-md transition-all">
          View Details
        </Link>
      </div>
    </div>
  )
}

export default function CompareFunds() {
  const [searchParams, setSearchParams] = useSearchParams()
  const primaryId = searchParams.get('primary')
  const compareIds = searchParams.getAll('compare')
  
  const [allFundsList, setAllFundsList] = useState([])
  const [category, setCategory] = useState(null)
  
  useEffect(() => {
    fetchFundsList().then(list => {
      setAllFundsList(list)
      // Determine category from primary fund
      if (primaryId) {
        const primary = list.find(f => (f.id === primaryId || f.sebi_code === primaryId))
        if (primary) {
          setCategory(primary.category)
        }
      }
    }).catch(console.error)
  }, [primaryId])

  const columns = [
    { id: primaryId, isPrimary: true },
    ...compareIds.map(id => ({ id, isPrimary: false }))
  ]

  // Ensure there are always at least 2 columns, pad with empty columns up to 3 max
  if (columns.length < 2) columns.push({ id: null, isPrimary: false })

  const removeCompare = (idToRemove) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('compare')
    compareIds.filter(id => id !== idToRemove).forEach(id => newParams.append('compare', id))
    setSearchParams(newParams)
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            ⚖️ Fund Comparison
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Compare <span className="gradient-text">Side-by-Side</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            {category 
              ? `Comparing funds in the "${category}" category. Evaluate performance, risk, and metrics to make the right choice.`
              : 'Select funds to compare their performance and metrics.'}
          </p>
        </motion.div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {columns.map((col, index) => (
            <div key={`${col.id}-${index}`} className="flex-1 min-w-[320px] snap-center">
              <CompareColumn 
                id={col.id} 
                onRemove={!col.isPrimary && col.id ? () => removeCompare(col.id) : null}
                allFundsList={allFundsList}
                category={category}
              />
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  )
}
