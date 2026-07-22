import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faqs } from '../data/data'

export default function FAQ() {
  const [openId, setOpenId] = useState(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const toggle = (id) => setOpenId(openId === id ? null : id)

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-32">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
              ❓ FAQs
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-5">
              Frequently Asked
              <br />
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              Everything you need to know about investing with SIF. Can't find an answer? Our team is available 24/7.
            </p>
            
            {/* Support Card */}
            <div className="bg-gradient-to-br from-[#032e92] to-[#0a4fd4] rounded-3xl p-7 text-white">
              <p className="text-2xl font-bold mb-2">Still have questions?</p>
              <p className="text-blue-200 font-medium mb-5 text-sm">Our investment experts are ready to help you.</p>
              <div className="flex gap-3">
                <a href="#chat" className="flex-1 text-center py-3 rounded-2xl bg-white text-[#032e92] text-sm font-bold hover:bg-blue-50 transition-colors">
                  Live Chat
                </a>
                <a href="tel:1800-123-4567" className="flex-1 text-center py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-colors">
                  Call Us
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right - Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openId === faq.id
                    ? 'border-[#032e92]/30 shadow-lg shadow-blue-900/10 bg-[#eef4ff]/50'
                    : 'border-[#e8edf7] bg-white hover:border-[#032e92]/20 hover:shadow-md'
                }`}>
                
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                  <span className={`font-semibold text-sm flex-1 ${
                    openId === faq.id ? 'text-[#032e92]' : 'text-gray-800'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openId === faq.id ? 'bg-[#032e92] text-white' : 'bg-[#f7f9fc] text-gray-400'
                  }`}>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`text-xs transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}>
                      <div className="px-6 pb-5">
                        <div className="h-px bg-[#e8edf7] mb-4" />
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
