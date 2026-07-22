import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMoneyBillTrendUp, faUsers, faBriefcase, faUserTie
} from '@fortawesome/free-solid-svg-icons'

const statItems = [
  { icon: faMoneyBillTrendUp, prefix: '₹', value: 100, suffix: ' Cr+', label: 'Assets Under Management', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
  { icon: faUsers, prefix: '', value: 5000, suffix: '+', label: 'Happy Investors', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
  { icon: faBriefcase, prefix: '', value: 150, suffix: '+', label: 'Investment Products', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
  { icon: faUserTie, prefix: '', value: 25, suffix: '+', label: 'Expert Advisors', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50' },
]

function AnimatedNumber({ value, duration = 2000, inView }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = 0
    const end = value
    const step = Math.ceil(end / (duration / 16))
    let current = start
    const timer = setInterval(() => {
      current = Math.min(current + step, end)
      setCount(current)
      if (current >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value, duration])
  return <span>{count.toLocaleString()}</span>
}

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`${stat.bg} rounded-3xl p-6 border border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center`}>
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.prefix}
                <AnimatedNumber value={stat.value} inView={inView} />
                {stat.suffix}
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
