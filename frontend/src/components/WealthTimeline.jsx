import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowUp, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

const MILESTONES = [
  { label: '₹10 Lakh', target: 1000000 },
  { label: '₹25 Lakh', target: 2500000 },
  { label: '₹50 Lakh', target: 5000000 },
  { label: '₹75 Lakh', target: 7500000 },
  { label: '₹1 Crore', target: 10000000 },
]

function findYear(yearlyData, target) {
  const row = yearlyData.find(d => d.value >= target)
  return row ? row.year : null
}

export default function WealthTimeline({ yearlyData, results }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const maxVal = results.futureValue || 1

  const milestones = MILESTONES.map(m => ({
    ...m,
    year: findYear(yearlyData, m.target),
    achieved: maxVal >= m.target,
    pct: Math.min((m.target / maxVal) * 100, 100),
  }))

  const achievedCount = milestones.filter(m => m.achieved).length

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleArrowUp} className="text-[#032e92] text-sm" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Wealth Milestones</h2>
          </div>
          <p className="text-xs text-gray-400 font-medium mb-7 ml-10">
            {achievedCount} of {MILESTONES.length} milestones achieved with your current plan
          </p>

          {/* Progress bar timeline */}
          <div className="relative">
            {/* Vertical track */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#e8edf7] rounded-full" />

            {/* Animated fill */}
            <motion.div
              className="absolute left-5 top-0 w-0.5 bg-gradient-to-b from-[#032e92] to-green-500 rounded-full origin-top"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: achievedCount / MILESTONES.length } : {}}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }} />

            <div className="space-y-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                  className="relative flex items-center gap-4 pl-12">

                  {/* Node */}
                  <div className={`absolute left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    m.achieved
                      ? 'bg-[#032e92] border-[#032e92] shadow-md shadow-blue-900/30'
                      : 'bg-white border-[#e8edf7]'
                  }`}>
                    {m.achieved && (
                      <FontAwesomeIcon icon={faCircleCheck} className="text-white text-[8px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 flex items-center justify-between rounded-2xl px-5 py-4 border transition-all ${
                    m.achieved
                      ? 'bg-gradient-to-r from-[#eef4ff] to-[#f7f9fc] border-blue-100'
                      : 'bg-[#f7f9fc] border-[#e8edf7]'
                  }`}>
                    <div>
                      <p className={`text-base font-bold ${m.achieved ? 'text-[#032e92]' : 'text-gray-400'}`}>{m.label}</p>
                      <p className="text-xs font-medium text-gray-400">
                        {m.achieved
                          ? m.year ? `Reached by Year ${m.year}` : 'Achieved'
                          : 'Not reached with current plan'
                        }
                      </p>
                    </div>
                    {m.achieved && m.year && (
                      <div className="text-right">
                        <div className="bg-[#032e92] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">
                          Year {m.year}
                        </div>
                      </div>
                    )}
                    {!m.achieved && (
                      <span className="text-xs text-gray-300 font-medium bg-gray-100 px-3 py-1.5 rounded-xl">
                        Increase SIP
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
