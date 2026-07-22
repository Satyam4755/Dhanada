import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp, faShieldHalved, faArrowRight, faBuildingColumns } from '@fortawesome/free-solid-svg-icons'

const riskConfig = {
  'Low': 'bg-green-100 text-green-700 border-green-200',
  'Moderate': 'bg-amber-100 text-amber-700 border-amber-200',
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Very High': 'bg-red-200 text-red-800 border-red-300',
}

export default function RelatedFunds({ funds }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <section ref={ref} className="py-12 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-[#032e92] uppercase tracking-widest mb-1">Similar Funds</p>
            <h2 className="text-2xl font-bold text-gray-900">Related Funds</h2>
          </div>
          <a href="/funds" className="flex items-center gap-1.5 text-sm font-semibold text-[#032e92] hover:text-[#021d63] transition-colors">
            View All <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </a>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {funds.map((fund, i) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${fund.logoColor} flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform`}>
                  {fund.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-xs leading-snug line-clamp-2 group-hover:text-[#032e92] transition-colors">{fund.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{fund.category}</p>
                </div>
              </div>

              <div className="bg-[#f7f9fc] rounded-2xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">1Y Return</p>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 text-xs" />
                      <span className="text-lg font-bold text-green-600">{fund.returns1Y}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-medium">NAV</p>
                    <span className="text-sm font-bold text-[#032e92]">{fund.nav}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${riskConfig[fund.risk]}`}>
                  {fund.risk}
                </span>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-[#032e92] text-white text-xs font-bold hover:bg-[#021d63] shadow-sm shadow-blue-900/20 transition-all flex items-center justify-center gap-1.5">
                Invest Now <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
