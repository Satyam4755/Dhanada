import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight, faArrowTrendUp, faBuildingColumns
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

import { getRiskLevelConfig } from '../utils/risk'

export default function RecommendedFundCard({ fund, index }) {
  const navigate = useNavigate();

  const handleFundClick = () => {
    navigate(`/funds/${encodeURIComponent(fund.id)}`);
  };

  return (
    <motion.div
      onClick={handleFundClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="bg-white border border-[#e8edf7] rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">

      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] text-[#032e92] flex items-center justify-center text-xl shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
          {fund.name ? fund.name.substring(0, 1) : 'F'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#032e92] transition-colors line-clamp-1">
            {fund.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <FontAwesomeIcon icon={faBuildingColumns} className="text-gray-300 text-[10px]" />
            <span className="text-xs text-gray-400 font-medium truncate">{fund.amc}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] font-semibold bg-[#eef4ff] text-[#032e92] px-2 py-0.5 rounded-full">{fund.category}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRiskLevelConfig(fund.riskLevel).bg} ${getRiskLevelConfig(fund.riskLevel).text} ${getRiskLevelConfig(fund.riskLevel).border}`}>
              {getRiskLevelConfig(fund.riskLevel).level !== 'N/A' ? `Level ${getRiskLevelConfig(fund.riskLevel).level}` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="hidden md:grid grid-cols-3 gap-4 flex-shrink-0">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">AUM</p>
            <p className="text-sm font-bold text-gray-800">{fund.aum != null ? fund.aum : 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">3Y Return</p>
            <div className="flex items-center justify-center gap-1">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 text-[10px]" />
              <p className="text-sm font-bold text-green-600">{fund.returns3Y != null ? `${fund.returns3Y}%` : 'N/A'}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Exp. Ratio</p>
            <p className="text-sm font-bold text-gray-800">{fund.expenseRatio != null ? `${fund.expenseRatio}%` : 'N/A'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e8edf7] text-gray-500 text-xs font-semibold hover:border-[#032e92] hover:text-[#032e92] transition-all whitespace-nowrap">
            Know More
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#032e92] text-white text-xs font-bold hover:bg-[#021d63] shadow-md shadow-blue-900/20 transition-all whitespace-nowrap">
            Invest <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </button>
        </div>
      </div>

      {/* Mobile metrics */}
      <div className="md:hidden mt-3 pt-3 border-t border-[#e8edf7] grid grid-cols-3 gap-2">
        {[
          { label: 'AUM', val: fund.aum != null ? fund.aum : 'N/A' },
          { label: '3Y Return', val: fund.returns3Y != null ? `${fund.returns3Y}%` : 'N/A', green: true },
          { label: 'Exp. Ratio', val: fund.expenseRatio != null ? `${fund.expenseRatio}%` : 'N/A' },
        ].map(m => (
          <div key={m.label} className="text-center bg-[#f7f9fc] rounded-xl p-2">
            <p className="text-[10px] text-gray-400 font-medium">{m.label}</p>
            <p className={`text-xs font-bold ${m.green && m.val !== 'N/A' ? 'text-green-600' : 'text-gray-800'}`}>{m.val}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
