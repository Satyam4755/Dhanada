import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartColumn } from '@fortawesome/free-solid-svg-icons'

const fmt = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function LumpsumProjectionTable({ yearlyData }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-[#e8edf7]">
            <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
              <FontAwesomeIcon icon={faChartColumn} className="text-[#032e92] text-sm" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Yearly Growth Breakdown</h2>
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#f7f9fc] border-b border-[#e8edf7]">
                  {['Year', 'Invested Amount', 'Est. Returns', 'Total Value'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8edf7]">
                {yearlyData.map((row, i) => (
                  <motion.tr
                    key={row.year}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: Math.min(i * 0.04, 0.5), duration: 0.4 }}
                    className="hover:bg-[#f7f9fc] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#eef4ff] text-[#032e92] text-xs font-bold flex items-center justify-center">
                          {row.year}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-700">{fmt(row.invested)}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-green-600">{fmt(row.gain)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-[#032e92]">{fmt(row.value)}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
