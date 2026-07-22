import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableCellsLarge, faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const ratingColors = {
  'AAA': 'bg-green-100 text-green-700',
  'AA+': 'bg-emerald-100 text-emerald-700',
  'AA': 'bg-teal-100 text-teal-700',
}

export default function HoldingsTable({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  
  if (!fund.holdings || fund.holdings.length === 0) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-8 text-center">
        <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-3xl mb-3" />
        <h3 className="font-bold text-gray-900 mb-1">Top Holdings Unavailable</h3>
        <p className="text-sm text-gray-500">Holdings data is not available for this scheme.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6">

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
            <FontAwesomeIcon icon={faTableCellsLarge} className="text-[#032e92] text-sm" />
          </div>
          <h3 className="font-bold text-gray-900">Top Holdings</h3>
        </div>
        <span className="text-xs font-semibold text-gray-400 bg-[#f7f9fc] border border-[#e8edf7] px-3 py-1 rounded-full">
          Top {fund.holdings.length} Stocks
        </span>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[580px]">
          <thead>
            <tr className="border-b border-[#e8edf7]">
              {['#', 'Company', 'Sector', 'Weight', 'Market Cap', 'Rating'].map(h => (
                <th key={h} className="pb-3 px-2 text-left text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8edf7]">
            {fund.holdings.map((h, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="hover:bg-[#f7f9fc] transition-colors group">
                <td className="py-3 px-2 text-xs font-bold text-gray-400">{i + 1}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] flex items-center justify-center text-xs font-bold text-[#032e92] flex-shrink-0 group-hover:scale-105 transition-transform">
                      {h.company.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-800 text-xs whitespace-nowrap">{h.company}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{h.sector}</span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-16 overflow-hidden">
                      <div
                        className="h-full bg-[#032e92] rounded-full"
                        style={{ width: `${(h.weight / 10) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#032e92]">{h.weight}%</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{h.marketCap}</span>
                </td>
                <td className="py-3 px-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ratingColors[h.rating] || 'bg-gray-100 text-gray-600'}`}>
                    {h.rating}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
