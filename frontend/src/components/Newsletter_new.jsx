import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleCheck, faBell } from '@fortawesome/free-solid-svg-icons'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <section id="newsletter" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl">
          
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#032e92] via-[#0a4fd4] to-[#021d63]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c10000]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

          {/* Decorative dots */}
          <div className="absolute top-8 left-8 grid grid-cols-4 gap-3 opacity-20">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>
          <div className="absolute bottom-8 right-8 grid grid-cols-4 gap-3 opacity-20">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>

          <div className="relative py-16 px-8 lg:px-16 text-center">
            {/* Icon */}
            <div className="inline-flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center mb-6 mx-auto">
              <FontAwesomeIcon icon={faBell} className="text-white text-2xl" />
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Stay Ahead of the Market
            </h2>
            <p className="text-blue-200 font-medium mb-8 max-w-lg mx-auto">
              Get weekly market insights, fund performance reports, and exclusive investment tips delivered straight to your inbox. Join 5,000+ investors.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {['Weekly market insights', 'Exclusive fund reports', 'Expert investment tips', 'No spam, ever'].map(b => (
                <div key={b} className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-green-400 text-xs" />
                  {b}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 font-medium text-sm focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                required />
              <button
                type="submit"
                className="btn-ripple flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#c10000] hover:bg-[#9d0000] text-white font-semibold shadow-xl shadow-red-900/30 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap">
                Subscribe Now
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </form>

            {/* Success message */}
            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-green-400 font-semibold">
                <FontAwesomeIcon icon={faCircleCheck} />
                You're subscribed! Check your inbox for a welcome email.
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
