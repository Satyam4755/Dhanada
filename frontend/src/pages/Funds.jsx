import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableCellsLarge, faList, faFilter, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FundsHero from '../components/FundsHero'
import FundFilters from '../components/FundFilters'
import ActiveFilters from '../components/ActiveFilters'
import FundGrid from '../components/FundGrid'
import Pagination from '../components/Pagination'
import Newsletter from '../components/Newsletter'
import { fetchFundsList } from '../api/funds'


const ITEMS_PER_PAGE = 9

const defaultFilters = {
  assetClass: '',
  category: '',
  risk: '',
  amc: '',
  minInvestment: '',
  search: '',
  sort: 'returns',
}

const minInvestmentOrder = { '₹500': 500, '₹1,000': 1000, '₹5,000': 5000, '₹10,000': 10000, '₹50,000': 50000 }

function parseReturns(val) {
  if (val == null || val === '—') return -999 // fallback for missing returns in sorting
  if (typeof val === 'number') return val
  return parseFloat(val.replace('%', '')) || -999
}

function parseAUM(val) {
  if (val == null) return -999
  if (typeof val === 'number') return val
  const num = val.replace(/[₹,\s]/g, '').replace('Cr', '')
  return parseFloat(num) || -999
}

export default function Funds() {
  const [fundsData, setFundsData] = useState([])
  const [filters, setFilters] = useState(defaultFilters)
  const [isGrid, setIsGrid] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadFunds() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchFundsList()
        setFundsData(data || [])
      } catch (err) {
        setError(err.message || 'Failed to load funds. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    loadFunds()
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const filteredFunds = useMemo(() => {
    let result = [...fundsData]

    if (filters.assetClass) result = result.filter(f => f.assetClass === filters.assetClass)
    if (filters.category) result = result.filter(f => f.category === filters.category)
    if (filters.risk && filters.risk !== 'All') {
      const targetRisk = parseInt(filters.risk.replace('Risk Level ', ''), 10)
      result = result.filter(f => f.riskLevel === targetRisk)
    }
    if (filters.amc) result = result.filter(f => f.amc === filters.amc)
    if (filters.minInvestment) {
      result = result.filter(f => {
        const min = minInvestmentOrder[filters.minInvestment]
        const fundMin = typeof f.minInvestment === 'number' ? f.minInvestment : minInvestmentOrder[f.minInvestment]
        return fundMin != null && fundMin <= min
      })
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(f =>
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.amc && f.amc.toLowerCase().includes(q)) ||
        (f.category && f.category.toLowerCase().includes(q))
      )
    }

    // Sort
    switch (filters.sort) {
      case 'aum':
        result.sort((a, b) => parseAUM(b.aum) - parseAUM(a.aum))
        break
      case 'returns':
        result.sort((a, b) => parseReturns(b.returns1Y) - parseReturns(a.returns1Y))
        break
      case 'risk':
        result.sort((a, b) => (b.riskLevel !== 'N/A' ? b.riskLevel : 0) - (a.riskLevel !== 'N/A' ? a.riskLevel : 0))
        break
      case 'alpha':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate))
        break
      default:
        break
    }
    return result
  }, [filters, fundsData])

  const totalPages = Math.ceil(filteredFunds.length / ITEMS_PER_PAGE)
  const paginatedFunds = filteredFunds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const clearFilters = () => setFilters(defaultFilters)

  // Compute dynamic AMC list
  const amcList = useMemo(() => {
    const amcs = new Set()
    fundsData.forEach(f => {
      if (f.amc) amcs.add(f.amc)
    })
    return Array.from(amcs).sort()
  }, [fundsData])

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main>
        {/* Hero */}
        <FundsHero />

        {/* Filters */}
        <FundFilters filters={filters} setFilters={setFilters} onClear={clearFilters} amcList={amcList} fundsData={fundsData} />

        {/* Active Filter Chips */}
        <ActiveFilters filters={filters} setFilters={setFilters} />

        {/* Results Area */}
        <section className="py-6 bg-[#f7f9fc]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[300px]">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-4xl mb-4 text-red-400" />
                <h3 className="text-lg font-bold mb-2">Error Loading Funds</h3>
                <p className="text-sm font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-bold transition-colors">
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Result header bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-between mb-6 bg-white rounded-2xl border border-[#e8edf7] px-5 py-3.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilter} className="text-[#032e92] text-sm" />
                    <span className="text-sm font-semibold text-gray-700">
                      Showing{' '}
                      <span className="text-[#032e92] font-bold">{filteredFunds.length}</span>
                      {' '}Fund{filteredFunds.length !== 1 ? 's' : ''}
                      {filteredFunds.length !== fundsData.length && (
                        <span className="text-gray-400 font-medium"> of {fundsData.length} total</span>
                      )}
                    </span>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-[#f7f9fc] border border-[#e8edf7] rounded-xl p-1">
                    <button
                      onClick={() => setIsGrid(false)}
                      title="List View"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        !isGrid
                          ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                          : 'text-gray-500 hover:text-[#032e92]'
                      }`}>
                      <FontAwesomeIcon icon={faList} />
                      <span className="hidden sm:inline">List</span>
                    </button>
                    <button
                      onClick={() => setIsGrid(true)}
                      title="Grid View"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        isGrid
                          ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                          : 'text-gray-500 hover:text-[#032e92]'
                      }`}>
                      <FontAwesomeIcon icon={faTableCellsLarge} />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                  </div>
                </motion.div>

                {/* Fund Cards */}
                <FundGrid
                  funds={loading ? [] : paginatedFunds}
                  isGrid={isGrid}
                  loading={loading} />

                {/* Pagination */}
                {!loading && filteredFunds.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page)
                      window.scrollTo({ top: 400, behavior: 'smooth' })
                    }} />
                )}
                
                {!loading && filteredFunds.length === 0 && (
                  <div className="text-center py-12 text-gray-500 font-medium">
                    No funds match your current filters.
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
