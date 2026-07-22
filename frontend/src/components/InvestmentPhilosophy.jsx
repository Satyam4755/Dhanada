import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowTrendUp, faShieldHalved, faCircleCheck, faGlobe
} from '@fortawesome/free-solid-svg-icons'

const pillars = [
  {
    icon: faArrowTrendUp,
    title: 'Long Term Growth',
    description: 'We focus on compounding wealth over 5-20 year horizons through disciplined equity investing.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: faShieldHalved,
    title: 'Risk Management',
    description: 'Sophisticated risk models and dynamic asset allocation protect your capital during downturns.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: faCircleCheck,
    title: 'Transparency',
    description: 'Real-time portfolio visibility, detailed fund analysis, and no hidden fees ever.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: faGlobe,
    title: 'Diversification',
    description: 'Intelligent diversification across sectors, geographies, and asset classes reduces risk.',
    color: 'from-amber-500 to-orange-500',
  },
]

export default function InvestmentPhilosophy() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="philosophy" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
              💡 Our Philosophy
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-5">
              Investment Philosophy
              <br />
              <span className="gradient-text">That Creates Wealth</span>
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-6">
              We believe wealth creation is a long-term journey that requires patience, discipline, and a sound strategy. Our philosophy is built on four core pillars that have consistently delivered superior risk-adjusted returns for our investors.
            </p>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              Our SEBI-registered advisors combine quantitative analysis with deep fundamental research to identify funds that can withstand market volatility and deliver consistent alpha over your investment horizon.
            </p>
            <div className="flex gap-8">
              {[['₹100 Cr+', 'AUM'], ['18.5%', 'Avg CAGR'], ['92%', 'Client Retention']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-3xl font-bold text-[#032e92]">{val}</p>
                  <p className="text-sm text-gray-500 font-medium">{lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Premium Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#032e92] to-[#0a4fd4] p-8 shadow-2xl shadow-blue-900/30">
              {/* Visual graph */}
              <div className="mb-6">
                <p className="text-blue-200 text-sm font-medium mb-2">Portfolio Performance vs Index</p>
                <div className="flex items-end gap-1 h-32 bg-white/5 rounded-2xl p-4">
                  {[30,45,35,60,50,80,70,95,85,110,100,130].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-1 h-full justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={inView ? { height: `${h * 0.8}%` } : {}}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                        className="w-full bg-gradient-to-t from-white/60 to-white/20 rounded-t-sm" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'SIF Portfolio', value: '+31.2%', color: 'text-green-400' },
                  { label: 'Nifty 50', value: '+18.6%', color: 'text-blue-300' },
                  { label: 'Alpha Generated', value: '+12.6%', color: 'text-amber-400' },
                  { label: 'Sharpe Ratio', value: '1.84', color: 'text-purple-300' },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-xl p-3 border border-white/10">
                    <p className="text-blue-200 text-xs">{item.label}</p>
                    <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-xl border border-[#e8edf7]">
              <p className="text-xs text-gray-400 font-medium">Certified By</p>
              <p className="font-bold text-[#032e92]">SEBI & AMFI ✓</p>
            </div>
          </motion.div>
        </div>

        {/* Pillar Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className="bg-white rounded-2xl p-6 border border-[#e8edf7] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <FontAwesomeIcon icon={p.icon} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#032e92] transition-colors">{p.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
