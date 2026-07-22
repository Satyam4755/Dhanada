import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen, faCircleCheck, faArrowRight,
  faShieldHalved, faArrowTrendUp, faChartPie, faCoins
} from '@fortawesome/free-solid-svg-icons'

const iconMap = { faShieldHalved, faArrowTrendUp, faChartPie, faCoins }

export default function ObjectiveSection({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <section id="objective" className="scroll-mt-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <FontAwesomeIcon icon={faBookOpen} className="text-amber-600 text-sm" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Fund Objective</h2>
        </div>

        {/* Objective paragraph */}
        <div className="bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] rounded-2xl p-6 mb-6 border border-blue-100">
          <p className="text-gray-700 font-medium leading-relaxed text-sm">{fund.objective}</p>
        </div>

        {/* Investment Strategy */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-[#032e92] text-sm" />
            Investment Strategy
          </h3>
          <div className="space-y-2.5">
            {fund.strategy.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3 bg-[#f7f9fc] rounded-xl px-4 py-3">
                <div className="w-5 h-5 rounded-full bg-[#032e92] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-white text-[9px]" />
                </div>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Suitable For */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowRight} className="text-green-600 text-sm" />
            Suitable For
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {fund.suitableFor.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <FontAwesomeIcon icon={faCircleCheck} className="text-green-600 text-sm flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 text-base">Key Features</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {fund.keyFeatures.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 bg-white border border-[#e8edf7] rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-9 h-9 rounded-xl bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={iconMap[feat.icon] || faChartPie} className="text-[#032e92] text-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{feat.label}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
