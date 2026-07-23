import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faStar, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { getRiskLevelConfig } from '../utils/risk'

const tabs = ['All', 'Equity', 'Debt', 'Hybrid', 'Alternative']

export default function TopFunds({ fundsData = [] }) {
  const [activeTab, setActiveTab] = useState('All')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const navigate = useNavigate()

  // Use the API's assetClass or category if type is missing, and sort by returns1Y
  const getSortedFunds = (data) => {
    return [...data].sort((a, b) => {
      const aRet = a.returns1Y != null ? parseFloat(a.returns1Y) : -Infinity;
      const bRet = b.returns1Y != null ? parseFloat(b.returns1Y) : -Infinity;
      return bRet - aRet;
    });
  };

  const filtered = activeTab === 'All'
    ? getSortedFunds(fundsData).slice(0, 5) // Show top 5
    : getSortedFunds(fundsData.filter(f => {
        const textToSearch = `${f.assetClass || ''} ${f.category || ''} ${f.investmentStrategy || ''}`.toLowerCase();
        return textToSearch.includes(activeTab.toLowerCase());
      })).slice(0, 5);

  const handleFundClick = (id) => {
    navigate(`/funds/${encodeURIComponent(id)}`);
  };

  return (
    <section id="top-funds" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            📊 Top Performing Funds
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Funds That <span className="gradient-text">Deliver Results</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Carefully curated, research-backed funds with consistent performance across market cycles.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[#032e92] text-white shadow-lg shadow-blue-900/20'
                  : 'bg-[#f7f9fc] text-gray-600 hover:bg-[#eef4ff] hover:text-[#032e92] border border-[#e8edf7]'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-[#e8edf7] overflow-hidden shadow-lg shadow-blue-900/5">
          {/* Table Header */}
          <div className="bg-[#f7f9fc] grid grid-cols-8 gap-4 px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-[#e8edf7]">
            <div>Rank</div>
            <div className="col-span-2">Fund Name</div>
            <div>NAV</div>
            <div>1Y Returns</div>
            <div>Risk</div>
            <div>AUM</div>
            <div className="text-center">Action</div>
          </div>

          <AnimatePresence>
            {filtered.length > 0 ? filtered.map((fund, i) => {
              const rank = i + 1;
              return (
              <motion.div
                key={fund.id}
                onClick={() => handleFundClick(fund.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="grid grid-cols-8 gap-4 items-center px-6 py-5 border-b border-[#e8edf7] hover:bg-[#f7f9fc] transition-colors group cursor-pointer">
                
                {/* Rank */}
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    fund.returns1Y == null ? 'bg-gray-100 text-gray-400' :
                    rank === 1 ? 'bg-amber-100 text-amber-600' :
                    rank === 2 ? 'bg-gray-100 text-gray-500' :
                    rank === 3 ? 'bg-orange-100 text-orange-500' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {fund.returns1Y != null ? rank : '-'}
                  </div>
                </div>

                {/* Fund Name */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] flex items-center justify-center text-lg border border-[#e8edf7] flex-shrink-0">
                    {fund.name ? fund.name.substring(0, 1) : 'F'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[#032e92] transition-colors line-clamp-1">{fund.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{fund.category}</p>
                  </div>
                </div>

                {/* NAV */}
                <div>
                  <p className="text-sm font-bold text-gray-800">{fund.nav != null ? `₹${fund.nav}` : 'N/A'}</p>
                  <p className="text-xs text-gray-400">NAV</p>
                </div>

                {/* Returns */}
                <div>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 text-xs" />
                    <span className="text-sm font-bold text-green-600">{fund.returns1Y != null ? `${fund.returns1Y}%` : 'N/A'}</span>
                  </div>
                  <p className="text-xs text-gray-400">Annualized</p>
                </div>

                {/* Risk */}
                <div className="flex gap-2 text-xs font-semibold">
                  <span className={`px-2.5 py-1 rounded-full border ${getRiskLevelConfig(fund.riskLevel).bg} ${getRiskLevelConfig(fund.riskLevel).text} ${getRiskLevelConfig(fund.riskLevel).border}`}>
                    {getRiskLevelConfig(fund.riskLevel).level !== 'N/A' ? `Level ${getRiskLevelConfig(fund.riskLevel).level}` : 'N/A'}
                  </span>
                </div>

                {/* AUM */}
                <div>
                  <p className="text-sm font-semibold text-gray-700">{fund.aum != null ? `₹${fund.aum}Cr` : 'N/A'}</p>
                  {fund.rating ? (
                    <div className="flex">
                      {Array.from({ length: fund.rating }).map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="text-amber-400 text-[10px]" />
                      ))}
                    </div>
                  ) : <span className="text-[10px] text-gray-400">Unrated</span>}
                </div>

                {/* Action */}
                <div className="flex justify-center">
                  <button className="btn-ripple px-4 py-2 rounded-full bg-[#032e92] text-white text-xs font-semibold hover:bg-[#021d63] shadow-md shadow-blue-900/20 transition-all duration-200 flex items-center gap-1.5 group-hover:scale-105">
                    View
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </button>
                </div>
              </motion.div>
            )}) : (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                No funds found in this category.
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center mt-8">
          <a href="/funds" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#032e92] text-[#032e92] font-semibold hover:bg-[#032e92] hover:text-white transition-all duration-200">
            View All Funds
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  )
}
