import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

const faqs = [
  {
    q: 'What is a SIP (Systematic Investment Plan)?',
    a: 'A SIP is a disciplined way to invest a fixed amount of money in mutual funds at regular intervals (monthly, quarterly, etc.). It enables investors to participate in market growth through rupee cost averaging, reducing the impact of market volatility over time.',
  },
  {
    q: 'How is SIP return calculated?',
    a: 'SIP returns use the compound interest formula: FV = P × [((1 + r)ⁿ - 1) / r] × (1 + r), where P = monthly investment, r = monthly interest rate (annual rate ÷ 12), and n = total months. This calculator applies this formula to give you instant projections.',
  },
  {
    q: "What is the 'Expected Return' in this calculator?",
    a: 'Expected Return is the assumed annual rate of return on your investment. Historically, large-cap equity funds have delivered 12–15% annually, small-cap funds 15–20%, and debt funds 6–8%. Use conservative estimates for realistic planning.',
  },
  {
    q: 'Can SIP returns be guaranteed?',
    a: 'No. Mutual fund SIP returns are market-linked and not guaranteed. Past performance does not guarantee future returns. The returns shown in this calculator are illustrative projections based on assumed constant rates of return.',
  },
  {
    q: 'Should I increase my SIP amount yearly?',
    a: 'Yes! A Step-up SIP (increasing your investment by 5–10% annually) dramatically accelerates wealth creation. Even a 10% annual step-up can nearly double your corpus compared to a fixed SIP over 15–20 years.',
  },
  {
    q: 'What is a Step-up SIP?',
    a: 'A Step-up SIP allows you to automatically increase your monthly SIP amount by a fixed percentage each year. For example, if you invest ₹5,000/month and opt for a 10% step-up, your SIP becomes ₹5,500/month next year, ₹6,050/month the year after, and so on.',
  },
]

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-[#032e92]/30 shadow-md shadow-blue-900/5' : 'border-[#e8edf7]'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f7f9fc] transition-colors">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold transition-colors ${isOpen ? 'bg-[#032e92] text-white' : 'bg-[#eef4ff] text-[#032e92]'}`}>
            {index + 1}
          </div>
          <span className={`text-sm font-semibold transition-colors ${isOpen ? 'text-[#032e92]' : 'text-gray-800'}`}>{item.q}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FontAwesomeIcon icon={faChevronDown} className={`text-xs flex-shrink-0 ml-3 ${isOpen ? 'text-[#032e92]' : 'text-gray-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <div className="px-5 pb-4 pt-1">
              <div className="ml-9 bg-[#f7f9fc] rounded-xl px-4 py-3">
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{item.a}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SipFAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleQuestion} className="text-[#032e92] text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-xs text-gray-400 font-medium">SIP basics explained simply</p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.4 }}>
                <FAQItem item={item} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
