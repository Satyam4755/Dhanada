import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUmbrellaBeach, faPiggyBank } from '@fortawesome/free-solid-svg-icons'

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

export default function RetirementOutput({ results }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 })

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-3xl border border-green-200 shadow-xl shadow-green-900/5 p-8 lg:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Amount Required */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUmbrellaBeach} className="text-green-700 text-lg" />
                </div>
                <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide">
                  Amount required for retirement
                </h3>
              </div>
              <p className="text-4xl lg:text-5xl font-extrabold text-green-900 drop-shadow-sm">
                <CountUpNumber
                  target={results.requiredCorpus || 0}
                  prefix="₹"
                  inView={inView} />
              </p>
              <p className="text-xs font-semibold text-green-700 opacity-80 mt-1">
                Your estimated target corpus at age 60
              </p>
            </div>

            {/* Monthly Savings Needed */}
            <div className="flex flex-col gap-2 relative">
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -ml-6 lg:-ml-8 w-px h-24 bg-green-900/10" />
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPiggyBank} className="text-green-700 text-lg" />
                </div>
                <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide">
                  Monthly savings needed
                </h3>
              </div>
              <p className="text-4xl lg:text-5xl font-extrabold text-green-900 drop-shadow-sm">
                <CountUpNumber
                  target={results.monthlySavingsNeeded || 0}
                  prefix="₹"
                  inView={inView} />
              </p>
              <p className="text-xs font-semibold text-green-700 opacity-80 mt-1">
                Amount to invest every month starting today
              </p>
            </div>

          </div>

        </motion.div>
      </div>
    </section>
  )
}
