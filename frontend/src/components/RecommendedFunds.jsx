import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import RecommendedFundCard from './RecommendedFundCard'
import { fetchFundsList } from '../api/funds'

export default function RecommendedFunds({ inputs }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const { annualReturn, duration } = inputs

  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFunds() {
      try {
        const data = await fetchFundsList()
        setFunds(data || [])
      } catch (error) {
        console.error("Failed to load funds for recommendations:", error)
      } finally {
        setLoading(false)
      }
    }
    loadFunds()
  }, [])

  // Recommendation logic: sort by real returns
  const displayFunds = useMemo(() => {
    if (funds.length === 0) return []
    let candidates = [...funds]

    // Sort by returns descending
    candidates.sort((a, b) => {
      const retA = a.returns3Y != null ? a.returns3Y : (a.returns1Y || -999);
      const retB = b.returns3Y != null ? b.returns3Y : (b.returns1Y || -999);
      return retB - retA;
    });

    // Return top 5
    return candidates.slice(0, 5)
  }, [funds])

  if (loading) {
    return (
      <section className="bg-[#f7f9fc] pb-8 py-8 text-center text-gray-500">
        Loading recommendations...
      </section>
    );
  }

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>

          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-[#032e92] uppercase tracking-widest mb-1">Curated For You</p>
              <h2 className="text-2xl font-bold text-gray-900">Recommended Funds For Your SIP</h2>
              <p className="text-sm text-gray-400 font-medium mt-1">
                Based on your target return of <span className="text-[#032e92] font-bold">{annualReturn}%</span> over{' '}
                <span className="text-[#032e92] font-bold">{duration} years</span>
              </p>
            </div>
            <a href="/funds" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#032e92] hover:text-[#021d63] transition-colors">
              View All Funds <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </a>
          </div>

          {/* Fund List */}
          <div className="space-y-3">
            {displayFunds.map((fund, i) => (
              <RecommendedFundCard key={fund.id} fund={fund} index={i} />
            ))}
          </div>

          <div className="flex sm:hidden justify-center mt-4">
            <a href="/funds" className="flex items-center gap-1.5 text-sm font-semibold text-[#032e92]">
              View All Funds <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
