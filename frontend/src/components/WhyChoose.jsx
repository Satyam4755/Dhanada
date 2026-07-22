import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserTie, faShieldHalved, faChartLine, faHandshake
} from '@fortawesome/free-solid-svg-icons'

const features = [
  {
    icon: faUserTie,
    title: 'Investment Experts',
    description: 'Our team of 25+ SEBI-certified advisors brings decades of market experience to craft personalized investment strategies.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    delay: 0,
  },
  {
    icon: faShieldHalved,
    title: 'Secure Platform',
    description: 'Bank-grade 256-bit SSL encryption, two-factor authentication, and biometric login protect your investments and data.',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    delay: 0.1,
  },
  {
    icon: faChartLine,
    title: 'Research Driven',
    description: 'Every fund recommendation is backed by rigorous quantitative analysis, fundamental research, and macroeconomic insights.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    delay: 0.2,
  },
  {
    icon: faHandshake,
    title: 'Transparent Fees',
    description: 'Zero hidden charges. Our direct plans offer up to 1.5% lower expense ratios than regular plans, maximizing your returns.',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    delay: 0.3,
  },
]

export default function WhyChoose() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="why-choose" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            🏆 Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Built for <span className="gradient-text">Serious Investors</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            We combine cutting-edge technology with deep financial expertise to deliver an investment experience unlike any other.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: f.delay, duration: 0.6 }}
              className="bg-white rounded-3xl p-7 border border-[#e8edf7] shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <FontAwesomeIcon icon={f.icon} className="text-white text-xl" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#032e92] transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                {f.description}
              </p>

              {/* Bottom accent */}
              <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${f.color} rounded-full mt-5 transition-all duration-500`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
