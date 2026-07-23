import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight, faChartPie, faShieldHalved, faCoins,
  faArrowTrendUp, faStar, faArrowUpRightFromSquare, faBuildingColumns
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'
import { getRiskLevelConfig } from '../utils/risk'

const assetClassColors = {
  'Equity': 'bg-blue-100 text-blue-700',
  'Debt': 'bg-purple-100 text-purple-700',
  'Hybrid': 'bg-amber-100 text-amber-700',
  'Commodity': 'bg-yellow-100 text-yellow-700',
  'ETF': 'bg-teal-100 text-teal-700',
}

export default function FundCard({ fund, index, isGrid }) {
  const risk = getRiskLevelConfig(fund.riskLevel)
  const assetCls = assetClassColors[fund.assetClass] || 'bg-gray-100 text-gray-700'

  if (isGrid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 group overflow-hidden">

        {/* Card Top */}
        <div className="p-5 pb-4">
          {/* Logo + Name */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${fund.logoColor} flex items-center justify-center text-xl flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
              {fund.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[#032e92] transition-colors">{fund.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-gray-300 text-[10px]" />
                <p className="text-xs text-gray-400 font-medium truncate">{fund.amc}</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${assetCls}`}>{fund.assetClass}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#eef4ff] text-[#032e92]">{fund.category}</span>
            {fund.isNew && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">New</span>}
          </div>

          {/* Returns highlight */}
          <div className="bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] rounded-2xl p-3.5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">1Y Returns</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 text-xs" />
                  <span className="text-xl font-bold text-green-600">{fund.returns1Y != null ? `${fund.returns1Y}%` : 'N/A'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">3Y</p>
                <span className="text-base font-bold text-gray-700">{fund.returns3Y != null ? `${fund.returns3Y}%` : 'N/A'}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">NAV</p>
                <span className="text-xs font-bold text-[#032e92]">{fund.nav != null ? `₹${fund.nav}` : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-[#f7f9fc] rounded-xl p-2.5 text-center">
              <FontAwesomeIcon icon={faChartPie} className="text-[#032e92] text-xs mb-1" />
              <p className="text-[10px] text-gray-400 font-medium">AUM</p>
              <p className="text-xs font-bold text-gray-800">{fund.aum || 'N/A'}</p>
            </div>
            <div className="bg-[#f7f9fc] rounded-xl p-2.5 text-center">
              <FontAwesomeIcon icon={faCoins} className="text-amber-500 text-xs mb-1" />
              <p className="text-[10px] text-gray-400 font-medium">Min. SIP</p>
              <p className="text-xs font-bold text-gray-800">{fund.minInvestment != null ? `₹${fund.minInvestment.toLocaleString()}` : 'N/A'}</p>
            </div>
            <div className="bg-[#f7f9fc] rounded-xl p-2.5 text-center">
              <FontAwesomeIcon icon={faShieldHalved} className="text-gray-400 text-xs mb-1" />
              <p className="text-[10px] text-gray-400 font-medium">Risk</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${risk.bg} ${risk.text} ${risk.border}`}>{risk.level !== 'N/A' ? `Level ${risk.level}` : 'N/A'}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesomeIcon key={i} icon={i < (fund.rating || 0) ? faStar : faStarRegular}
                className={`text-xs ${i < (fund.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-xs text-gray-400 ml-1 font-medium">{fund.rating != null ? `${fund.rating}.0` : 'N/A'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e8edf7] px-5 py-4 flex gap-2">
          <button className="flex-1 py-2.5 rounded-xl bg-[#032e92] text-white text-xs font-bold hover:bg-[#021d63] shadow-md shadow-blue-900/20 transition-all duration-200 flex items-center justify-center gap-1.5">
            Invest Now <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </button>
          <Link to={`/funds/${encodeURIComponent(fund.id)}`} className="px-4 py-2.5 rounded-xl border-2 border-[#e8edf7] text-gray-500 text-xs font-bold hover:border-[#032e92] hover:text-[#032e92] transition-all duration-200 flex items-center justify-center">
            Details
          </Link>
        </div>
      </motion.div>
    )
  }

  // List view
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">

      <div className="p-5 lg:p-6">
        {/* Top Row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Logo */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${fund.logoColor} flex items-center justify-center text-2xl flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
            {fund.logo}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#032e92] transition-colors">{fund.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <FontAwesomeIcon icon={faBuildingColumns} className="text-gray-300 text-xs" />
                  <span className="text-xs text-gray-400 font-medium">{fund.amc}</span>
                  <span className="text-gray-200">•</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={i < fund.rating ? faStar : faStarRegular}
                        className={`text-[10px] ${i < fund.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${assetCls}`}>{fund.assetClass}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eef4ff] text-[#032e92]">{fund.category}</span>
                  {fund.isNew && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">🆕 New</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="btn-ripple flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#032e92] text-white text-sm font-semibold hover:bg-[#021d63] shadow-md shadow-blue-900/20 transition-all duration-200">
                  Invest Now
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
                <Link to={`/funds/${encodeURIComponent(fund.id)}`} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[#e8edf7] text-gray-600 text-sm font-semibold hover:border-[#032e92] hover:text-[#032e92] transition-all duration-200">
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                  Know More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Container */}
        <div className="bg-[#f7f9fc] rounded-2xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* AUM */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#e8edf7] flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faChartPie} className="text-[#032e92] text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">AUM</p>
                <p className="text-sm font-bold text-gray-800">{fund.aum || 'N/A'}</p>
              </div>
            </div>

            {/* Min Investment */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#e8edf7] flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCoins} className="text-amber-500 text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Min. SIP</p>
                <p className="text-sm font-bold text-gray-800">{fund.minInvestment != null ? `₹${fund.minInvestment.toLocaleString()}` : 'N/A'}</p>
              </div>
            </div>

            {/* Risk */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#e8edf7] flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faShieldHalved} className="text-gray-400 text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Risk</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${risk.bg} ${risk.text} ${risk.border}`}>{risk.level !== 'N/A' ? `Level ${risk.level}` : 'N/A'}</span>
              </div>
            </div>

            {/* 1Y Return */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-600 text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">3Y Return</p>
                <p className="text-sm font-bold text-green-600">{fund.returns3Y != null ? `${fund.returns3Y}%` : 'N/A'}</p>
              </div>
            </div>

            {/* Expense Ratio */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#e8edf7] flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faChartPie} className="text-purple-500 text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Exp. Ratio</p>
                <p className="text-sm font-bold text-gray-800">{fund.expenseRatio || 'N/A'}</p>
              </div>
            </div>

            {/* NAV */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef4ff] border border-blue-100 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCoins} className="text-[#032e92] text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">NAV</p>
                <p className="text-sm font-bold text-[#032e92]">{fund.nav != null ? `₹${fund.nav}` : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
