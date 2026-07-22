import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWallet, faArrowTrendUp, faChartPie
} from '@fortawesome/free-solid-svg-icons'

function CountUpNumber({ target, prefix = '', suffix = '', inView, decimals = 0 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(increment * step, target)
      setCount(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString('en-IN')

  return <span>{prefix}{formatted}{suffix}</span>
}

const cards = [
  {
    key: 'totalInvested',
    label: 'Invested amount',
    icon: faWallet,
    color: 'text-[#032e92]',
    bg: 'bg-[#eef4ff]',
    gradBorder: 'border-blue-100',
    prefix: '₹',
    suffix: '',
    decimals: 0,
  },
  {
    key: 'wealthGained',
    label: 'Est. returns',
    icon: faArrowTrendUp,
    color: 'text-green-600',
    bg: 'bg-green-50',
    gradBorder: 'border-green-100',
    prefix: '₹',
    suffix: '',
    decimals: 0,
  },
  {
    key: 'futureValue',
    label: 'Total value',
    icon: faChartPie,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    gradBorder: 'border-purple-100',
    prefix: '₹',
    suffix: '',
    decimals: 0,
  },
]

export default function StepUpSipSummaryCards({ results }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 })

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`bg-white rounded-3xl border ${card.gradBorder} shadow-lg shadow-blue-900/5 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <FontAwesomeIcon icon={card.icon} className={`${card.color} text-xl`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{card.label}</p>
                  <p className={`text-3xl font-bold ${card.color} leading-tight`}>
                    <CountUpNumber
                      target={results[card.key] || 0}
                      prefix={card.prefix}
                      suffix={card.suffix}
                      decimals={card.decimals}
                      inView={inView} />
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
