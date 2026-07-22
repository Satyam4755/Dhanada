import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

const faqs = [
  {
    q: 'How does this Retirement Calculator work?',
    a: 'It estimates the total corpus you will need by age 60 to maintain your selected lifestyle, factoring in inflation. It then calculates how much you need to save every month from today, based on whether you choose a Safe or Aggressive investment strategy.',
  },
  {
    q: 'What do the lifestyle options mean?',
    a: 'Your chosen lifestyle impacts your estimated future expenses. "Like a Monk" assumes you will spend less in retirement than you do now. "Happy the way I am" assumes your expenses will simply grow with standard inflation. "Like a King" assumes you want a luxurious retirement with significantly higher expenses.',
  },
  {
    q: 'What is the difference between Safe and Aggressive saving?',
    a: 'Safe investments (like PF, FD, Debt Funds) offer lower but guaranteed returns (typically around 7-8%), meaning you have to save a lot more each month. Aggressive investments (like Equity Mutual Funds) offer higher potential returns (typically 12%+), which significantly reduces the monthly amount you need to save.',
  },
  {
    q: 'Is inflation really that important?',
    a: 'Yes, inflation is the silent wealth killer. An expense of ₹25,000 today will cost over ₹1.9 Lakhs after 35 years at just 6% inflation. This calculator automatically accounts for inflation so you don\'t fall short of funds in the future.',
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

export default function RetirementFAQ() {
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
              <p className="text-xs text-gray-400 font-medium">Retirement planning explained</p>
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
