import { useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowTrendUp, faCoins, faShieldHalved, faChartPie,
  faArrowRight, faBookmark, faShareNodes, faFileArrowDown,
  faBuildingColumns, faCircleCheck
} from '@fortawesome/free-solid-svg-icons'

const riskConfig = {
  'Low': 'bg-green-100 text-green-700 border-green-200',
  'Moderate': 'bg-amber-100 text-amber-700 border-amber-200',
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Very High': 'bg-red-200 text-red-800 border-red-300',
}

export default function FundSummaryCard({ fund }) {
  const [bookmarked, setBookmarked] = useState(false)
  
  const formatPct = (val) => val === 'N/A' || val == null ? 'N/A' : `${val}%`

  return (
    <aside className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/8 overflow-hidden">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-[#032e92] to-[#0a4fd4] p-6 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#c10000]/15" />

        <div className="relative flex items-start gap-3 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${fund.logoColor} flex items-center justify-center text-2xl shadow-lg border-2 border-white/20 flex-shrink-0`}>
            {fund.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-white text-sm leading-snug line-clamp-2">{fund.name}</h2>
            <div className="flex items-center gap-1 mt-1">
              <FontAwesomeIcon icon={faBuildingColumns} className="text-blue-300 text-[10px]" />
              <p className="text-blue-200 text-xs font-medium">{fund.amc}</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 relative">
          <span className="bg-white/15 border border-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white">{fund.assetClass}</span>
          <span className="bg-white/15 border border-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white">{fund.category}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${riskConfig[fund.risk] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{fund.risk} Risk</span>
        </div>
      </div>

      {/* NAV Block */}
      <div className="px-5 py-4 border-b border-[#e8edf7] bg-[#f7f9fc]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Current NAV</p>
            <p className="text-2xl font-bold text-gray-900">{fund.nav}</p>
            <p className="text-xs text-gray-400">{fund.navDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">Today's Change</p>
            <p className="text-lg font-bold text-green-600">{fund.navChange}</p>
            <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">{fund.navChangePct}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-5 space-y-3">
        {[
          { icon: faChartPie, label: 'Fund Size', val: fund.fundSize, color: 'text-[#032e92]' },
          { icon: faCoins, label: 'Min. SIP', val: fund.minimumSIP, color: 'text-amber-600' },
          { icon: faArrowTrendUp, label: '1Y Returns', val: formatPct(fund.returns?.['1Y']), color: 'text-green-600' },
          { icon: faShieldHalved, label: 'Expense Ratio', val: formatPct(fund.expenseRatio), color: 'text-purple-600' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={item.icon} className={`${item.color} text-sm w-4`} />
              <span className="text-xs font-medium text-gray-500">{item.label}</span>
            </div>
            <span className={`text-sm font-bold ${item.color}`}>{item.val}</span>
          </div>
        ))}
      </div>

      {/* Returns pills */}
      <div className="px-5 pb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Returns</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[['1Y', fund.returns?.['1Y']], ['3Y', fund.returns?.['3Y']], ['5Y', fund.returns?.['5Y']]].map(([period, val]) => (
            <div key={period} className="bg-[#eef4ff] rounded-xl p-2 text-center">
              <p className="text-[10px] text-gray-400 font-medium">{period}</p>
              <p className="text-sm font-bold text-green-600">{formatPct(val)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="px-5 pb-5 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-2xl bg-[#032e92] text-white font-bold text-sm hover:bg-[#021d63] shadow-lg shadow-blue-900/25 transition-all flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faArrowRight} />
          Invest Now
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 rounded-2xl border-2 border-[#e8edf7] text-gray-600 font-semibold text-sm hover:border-[#032e92] hover:text-[#032e92] transition-all flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />
          Compare Fund
        </motion.button>
      </div>

      {/* Utility buttons */}
      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
            bookmarked ? 'bg-[#eef4ff] border-[#032e92] text-[#032e92]' : 'border-[#e8edf7] text-gray-500 hover:border-[#032e92]/40'
          }`}>
          <FontAwesomeIcon icon={faBookmark} className="text-xs" />
          {bookmarked ? 'Saved' : 'Save'}
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#e8edf7] text-xs font-semibold text-gray-500 hover:border-[#032e92]/40 transition-all">
          <FontAwesomeIcon icon={faShareNodes} className="text-xs" />
          Share
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#e8edf7] text-xs font-semibold text-gray-500 hover:border-[#032e92]/40 transition-all">
          <FontAwesomeIcon icon={faFileArrowDown} className="text-xs" />
          PDF
        </button>
      </div>
    </aside>
  )
}
