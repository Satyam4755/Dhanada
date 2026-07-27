import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { comparisonData } from '../data/data'

const positives = ['✓']
const negatives = ['✗']

const columnColors = [
  'bg-[#032e92] text-white', // Mutual Funds - highlighted
  '',
  '',
  '',
  '',
  '',
]

export default function Comparison() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="comparison" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            ⚖️ Smart Comparison
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Mutual Funds <span className="gradient-text">Win Every Time</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Compare investment options side by side and see why mutual funds consistently outperform alternatives.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="overflow-x-auto rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5">
          <table className="w-full min-w-[700px]">
            {/* Header */}
            <thead>
              <tr className="border-b border-[#e8edf7]">
                <th className="bg-gray-50 px-6 py-5 text-left text-sm font-semibold text-gray-400 w-40">Feature</th>
                {comparisonData.headers.slice(1).map((header, i) => (
                  <th key={header}
                    className={`px-5 py-5 text-center text-sm font-bold ${
                      i === 0
                        ? 'bg-[#032e92] text-white rounded-t-2xl shadow-lg'
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                    {i === 0 && (
                      <span className="block text-[10px] text-blue-200 font-medium mb-0.5">⭐ Recommended</span>
                    )}
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonData.rows.map((row, ri) => (
                <tr key={ri}
                  className={`border-b border-[#e8edf7] transition-colors hover:bg-[#f7f9fc] ${
                    ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-xs" />
                      <span className="text-sm font-semibold text-gray-600">{row.feature}</span>
                    </div>
                  </td>
                  {row.values.map((val, vi) => (
                    <td key={vi} className={`px-5 py-4 text-center ${
                      vi === 0 ? 'bg-[#032e92]/5 border-x border-[#032e92]/10' : ''
                    }`}>
                      {val === '✓' ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                          <FontAwesomeIcon icon={faCircleCheck} className="text-green-600 text-xs" />
                        </span>
                      ) : val === '✗' ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                          <FontAwesomeIcon icon={faXmark} className="text-red-500 text-xs" />
                        </span>
                      ) : (
                        <span className={`text-sm font-semibold ${
                          vi === 0 ? 'text-[#032e92]' : 'text-gray-600'
                        }`}>{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
