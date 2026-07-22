import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'objective', label: 'Objective' },
  { id: 'fund-details', label: 'Fund Details' },
  { id: 'performance', label: 'Performance' },
  { id: 'holdings', label: 'Holdings' },
  { id: 'fund-managers', label: 'Fund Managers' },
  { id: 'documents', label: 'Documents' },
]

export default function FundTabs() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stuck, setStuck] = useState(false)
  const tabsRef = useRef(null)
  const scrollRef = useRef(null)

  // Scrollspy: detect which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    TABS.forEach(tab => {
      const el = document.getElementById(tab.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Sticky detection
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        setStuck(window.scrollY > 90)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll active tab into view
  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-tab="${activeTab}"]`)
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeTab])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 130
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={tabsRef}
      className={`sticky top-20 z-40 transition-all duration-300 ${
        stuck ? 'bg-white shadow-md shadow-blue-900/8 border-b border-[#e8edf7]' : 'bg-white/90 backdrop-blur-sm border-b border-[#e8edf7]'
      }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={scrollRef} className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={`relative flex-shrink-0 px-4 py-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#032e92]'
                  : 'text-gray-500 hover:text-[#032e92]'
              }`}>
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#032e92] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
