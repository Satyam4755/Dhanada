import { motion } from 'framer-motion'
import CalculatorNav from './CalculatorNav'

export default function StepUpSipHero() {
  return (
    <section className="pt-24 pb-6 bg-[#f7f9fc] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#032e92] via-[#0a4fd4] to-[#021d63] p-8 lg:p-10 shadow-xl shadow-blue-900/10">

          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-[#c10000]/10 pointer-events-none" />

          <div className="relative">


            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Step Up SIP{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                Calculator
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-blue-100 font-medium leading-relaxed max-w-2xl text-sm mb-6">
              Maximize your wealth by increasing your SIP contributions over time. Calculate how stepping up your investments accelerates your financial goals.
            </motion.p>

            <CalculatorNav />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
