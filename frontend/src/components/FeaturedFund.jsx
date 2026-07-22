import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight, faArrowUpRightFromSquare, faShieldHalved,
  faArrowTrendUp, faPercent, faRankingStar
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export default function FeaturedFund({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const navigate = useNavigate()

  if (!fund) return null;

  const handleFundClick = () => {
    navigate(`/funds/${encodeURIComponent(fund.id)}`);
  };

  return (
    <section id="featured" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl cursor-pointer"
          onClick={handleFundClick}>
          
          {/* Gradient background */}
          <div className="absolute inset-0 animated-gradient opacity-90 bg-[#032e92]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#021d63]/80 to-[#c10000]/60" />
          
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-white/5 blur-2xl" />

          <div className="relative p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div>
                {/* Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="glass px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20">
                    ⭐ Featured Fund of the Month
                  </span>
                  <span className="bg-green-500/20 border border-green-400/30 px-3 py-1.5 rounded-full text-xs font-semibold text-green-300">
                    ✓ SEBI Registered
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {fund.name}
                </h2>
                <p className="text-blue-200 font-medium mb-6">{fund.category} • {fund.schemeType || 'Open Ended Scheme'}</p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="glass rounded-2xl p-4 border border-white/20 text-center">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-400 text-lg mb-2" />
                    <p className="text-white text-xl font-bold">{fund.returns1Y != null ? `${fund.returns1Y}%` : 'N/A'}</p>
                    <p className="text-blue-200 text-xs">1Y Returns</p>
                  </div>
                  <div className="glass rounded-2xl p-4 border border-white/20 text-center">
                    <FontAwesomeIcon icon={faPercent} className="text-amber-400 text-lg mb-2" />
                    <p className="text-white text-xl font-bold">{fund.returns3Y != null ? `${fund.returns3Y}%` : 'N/A'}</p>
                    <p className="text-blue-200 text-xs">3Y Returns</p>
                  </div>
                  <div className="glass rounded-2xl p-4 border border-white/20 text-center">
                    <FontAwesomeIcon icon={faRankingStar} className="text-purple-400 text-lg mb-2" />
                    <p className="text-white text-xl font-bold">{fund.rating != null ? `${fund.rating}★` : 'N/A'}</p>
                    <p className="text-blue-200 text-xs">Rating</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button onClick={(e) => { e.stopPropagation(); handleFundClick(); }}
                    className="btn-ripple flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#032e92] font-semibold hover:bg-blue-50 shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                    <FontAwesomeIcon icon={faArrowRight} />
                    Invest Now
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleFundClick(); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all duration-200">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    View Details
                  </button>
                </div>
              </div>

              {/* Right Info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'NAV', value: fund.nav != null ? `₹${fund.nav}` : 'N/A', change: fund.navDate || '', positive: true },
                  { label: 'AUM', value: fund.aum != null ? fund.aum : 'N/A', change: fund.category, positive: null },
                  { label: 'Min. Investment', value: fund.minInvestment != null ? `₹${fund.minInvestment.toLocaleString()}` : 'N/A', change: 'SIP / Lump Sum', positive: null },
                  { label: 'Risk Level', value: fund.risk || 'N/A', change: '', positive: null },
                  { label: 'Exit Load', value: fund.exitLoad || 'N/A', change: '', positive: null },
                  { label: 'Expense Ratio', value: fund.expenseRatio != null ? `${fund.expenseRatio}%` : 'N/A', change: 'Direct Plan', positive: true },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon icon={faShieldHalved} className="text-blue-300 text-xs" />
                      <p className="text-blue-200 text-xs font-medium">{item.label}</p>
                    </div>
                    <p className="text-white font-bold text-base">{item.value}</p>
                    <p className={`text-xs font-medium ${
                      item.positive === true ? 'text-green-400' :
                      item.positive === false ? 'text-red-400' : 'text-blue-200'
                    }`}>{item.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
