import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck, faWallet, faFileInvoiceDollar, faChartLine
} from '@fortawesome/free-solid-svg-icons'

const steps = [
  {
    number: '01',
    icon: faCircleCheck,
    title: 'Create Account',
    description: 'Sign up in minutes with your email and mobile number. No paperwork required.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    number: '02',
    icon: faFileInvoiceDollar,
    title: 'Complete KYC',
    description: 'Complete digital KYC with Aadhaar & PAN verification in just 5 minutes.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    number: '03',
    icon: faChartLine,
    title: 'Choose Funds',
    description: 'Browse 150+ curated funds and select based on your risk profile and goals.',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    number: '04',
    icon: faWallet,
    title: 'Track Portfolio',
    description: 'Monitor real-time performance, set alerts, and optimize your portfolio anytime.',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
]

export default function InvestmentProcess() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            🚀 How It Works
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Start Investing in <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            From registration to your first investment — we make the process seamless, fast, and completely digital.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-16 left-[12.5%] right-[12.5%] hidden lg:block">
            <div className="h-0.5 bg-gradient-to-r from-blue-200 via-[#032e92]/30 to-purple-200" />
            <div className="flex justify-between -mt-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.2 }}
                  className="w-3 h-3 rounded-full bg-[#032e92]" />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className={`relative ${step.bg} rounded-3xl p-7 border ${step.borderColor} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
                
                {/* Step number badge */}
                <div className={`absolute -top-4 left-6 w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {i + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg mt-3 group-hover:scale-110 transition-transform`}>
                  <FontAwesomeIcon icon={step.icon} className="text-white text-xl" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-center mt-12">
          <a href="#invest"
            className="btn-ripple inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[#032e92] text-white font-semibold shadow-xl shadow-blue-900/25 hover:bg-[#021d63] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            Start Your Journey Today
            <FontAwesomeIcon icon={faCircleCheck} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
