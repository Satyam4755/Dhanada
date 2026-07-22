import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faArrowTrendUp, faShieldHalved } from '@fortawesome/free-solid-svg-icons'

export default function FundsHero() {
  return (
    <section className="pt-28 pb-10 bg-[#f7f9fc] relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] blur-3xl opacity-70 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#eef4ff] to-[#c7d2fe] blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#032e92] via-[#0a4fd4] to-[#021d63] p-10 lg:p-14 shadow-2xl shadow-blue-900/30">

          {/* Inner decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#c10000]/10 pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

          {/* Floating animated dot grid */}
          <div className="absolute top-6 right-6 grid grid-cols-5 gap-2 opacity-20 pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, delay: i * 0.08, repeat: Infinity }}
              />
            ))}
          </div>

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-blue-100 font-medium mb-5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                150+ Live Funds Available
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Live Investment
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                  Funds
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-blue-100 font-medium leading-relaxed max-w-md">
                Compare investment opportunities and choose the right fund for your financial goals. Start with as little as ₹500.
              </motion.p>
            </div>

            {/* Right - Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="grid grid-cols-3 gap-4">
              {[
                { icon: faChartLine, label: 'Avg. 1Y Return', value: '24.6%', color: 'from-green-400 to-emerald-500' },
                { icon: faArrowTrendUp, label: 'Top Performer', value: '52.4%', color: 'from-amber-400 to-orange-500' },
                { icon: faShieldHalved, label: 'SEBI Regulated', value: '100%', color: 'from-blue-300 to-cyan-400' },
              ].map((stat, i) => (
                <div key={i} className="glass rounded-2xl p-5 border border-white/20 text-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                    <FontAwesomeIcon icon={stat.icon} className="text-white text-sm" />
                  </div>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                  <p className="text-blue-200 text-xs font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
