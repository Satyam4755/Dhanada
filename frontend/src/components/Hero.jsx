import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleArrowRight, faCirclePlay, faArrowTrendUp, faChartPie,
  faCoins, faChartLine
} from '@fortawesome/free-solid-svg-icons'
import { useInView } from 'react-intersection-observer'
import { stats } from '../data/data'

const floatingCards = [
  {
    icon: faArrowTrendUp,
    color: 'from-green-400 to-emerald-500',
    label: 'Portfolio Growth',
    value: '+28.4%',
    sub: 'This Year',
  },
  {
    icon: faChartPie,
    color: 'from-blue-400 to-indigo-500',
    label: 'Asset Allocation',
    value: '6 Funds',
    sub: 'Diversified',
  },
  {
    icon: faCoins,
    color: 'from-amber-400 to-orange-500',
    label: 'Monthly SIP',
    value: '₹12,500',
    sub: 'Active',
  },
]

function AnimatedNumber({ value, duration = 2000, inView }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const end = value
    const step = Math.ceil(end / (duration / 16))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, end)
      setCount(current)
      if (current >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value, duration])
  return <span>{count.toLocaleString()}</span>
}

const StatCard = ({ prefix, value, suffix, label, delay }) => {
  const { ref, inView } = useInView({ triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="glass rounded-2xl px-5 py-4 text-center border border-white/20">
      <div className="text-2xl font-bold text-white">
        {prefix}<AnimatedNumber value={value} inView={inView} />{suffix}
      </div>
      <p className="text-blue-200 text-xs font-medium mt-1">{label}</p>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#021d63] via-[#032e92] to-[#0a4fd4]" />
      
      {/* Animated circles */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[#c10000]/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#032e92]/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-blue-100 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              SEBI Registered Investment Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              Invest <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Smarter.</span>
              <br />
              Grow Wealth
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">Confidently.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-blue-100 text-lg font-medium leading-relaxed mb-8 max-w-lg">
              India's most trusted investment platform offering curated mutual funds, expert advisory, and AI-powered portfolio management. Start your wealth creation journey today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12">
              <a href="#invest"
                className="btn-ripple flex items-center gap-2 px-8 py-4 rounded-full bg-[#c10000] hover:bg-[#9d0000] text-white font-semibold shadow-xl shadow-red-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <FontAwesomeIcon icon={faCircleArrowRight} />
                Start Investing
              </a>
              <a href="#top-funds"
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold transition-all duration-300 hover:-translate-y-1">
                <FontAwesomeIcon icon={faChartLine} />
                Explore Funds
              </a>
              <a href="#video" className="flex items-center gap-2 text-blue-200 hover:text-white font-medium transition-colors ml-2">
                <FontAwesomeIcon icon={faCirclePlay} className="text-xl" />
                Watch Demo
              </a>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat} delay={0.4 + i * 0.1} />
              ))}
            </div>
          </div>

          {/* Right Column - Dashboard */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative">
              
              {/* Main Dashboard Card */}
              <div className="glass rounded-3xl p-6 border border-white/20 shadow-2xl float-anim">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-blue-200 text-xs font-medium">Portfolio Value</p>
                    <p className="text-white text-3xl font-bold">₹14,82,340</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-400 text-xs" />
                      <span className="text-green-400 text-sm font-semibold">+₹2,14,560 (16.9%)</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartPie} className="text-white text-lg" />
                  </div>
                </div>

                {/* Chart visualization */}
                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <div className="flex items-end gap-2 h-24 justify-around">
                    {[40, 55, 45, 70, 60, 85, 75, 95, 80, 100, 88, 110].map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                          className={`w-full rounded-t-sm ${i === 11 ? 'bg-amber-400' : 'bg-white/40'}`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-blue-200">
                    <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                    <span>Jun</span><span className="text-amber-400 font-bold">Jul</span>
                  </div>
                </div>

                {/* Fund List */}
                <div className="space-y-3">
                  {[
                    { name: 'Blue Chip Growth', alloc: 40, color: 'bg-blue-400', ret: '+28.4%' },
                    { name: 'Mid Cap Momentum', alloc: 30, color: 'bg-emerald-400', ret: '+35.6%' },
                    { name: 'Balanced Advantage', alloc: 30, color: 'bg-amber-400', ret: '+18.2%' },
                  ].map((fund) => (
                    <div key={fund.name} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${fund.color}`} />
                      <span className="text-white text-xs font-medium flex-1">{fund.name}</span>
                      <div className="bg-white/10 rounded-full px-2 py-0.5">
                        <span className="text-[10px] text-blue-200">{fund.alloc}%</span>
                      </div>
                      <span className="text-green-400 text-xs font-bold">{fund.ret}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Mini Cards */}
              {floatingCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.2 }}
                  className={`absolute glass rounded-2xl px-4 py-3 border border-white/20 shadow-xl float-anim ${
                    i === 0 ? '-right-8 top-12' :
                    i === 1 ? '-left-8 bottom-24' :
                    '-right-6 bottom-16'
                  }`}>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-2`}>
                    <FontAwesomeIcon icon={card.icon} className="text-white text-xs" />
                  </div>
                  <p className="text-blue-200 text-[10px]">{card.label}</p>
                  <p className="text-white text-sm font-bold">{card.value}</p>
                  <p className="text-green-400 text-[10px]">{card.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L48 69.3C96 58.7 192 37.3 288 32C384 26.7 480 37.3 576 42.7C672 48 768 48 864 42.7C960 37.3 1056 26.7 1152 26.7C1248 26.7 1344 37.3 1392 42.7L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#f7f9fc" />
        </svg>
      </div>
    </section>
  )
}
