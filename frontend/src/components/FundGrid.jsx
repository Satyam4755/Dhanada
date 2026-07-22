import { motion, AnimatePresence } from 'framer-motion'
import FundCard from './FundCard'

// Skeleton loader for loading state
function FundSkeleton({ isGrid }) {
  if (isGrid) {
    return (
      <div className="bg-white rounded-3xl border border-[#e8edf7] p-5 animate-pulse">
        <div className="flex gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-200 flex-shrink-0" />
          <div className="flex-1">
            <div className="h-3.5 bg-gray-200 rounded-full mb-2 w-4/5" />
            <div className="h-3 bg-gray-100 rounded-full w-2/3" />
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full w-1/2 mb-4" />
        <div className="bg-gray-100 rounded-2xl h-20 mb-4" />
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-xl h-14" />)}
        </div>
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    )
  }
  return (
    <div className="bg-white rounded-3xl border border-[#e8edf7] p-6 animate-pulse">
      <div className="flex gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded-full mb-2 w-2/3" />
          <div className="h-3 bg-gray-100 rounded-full w-1/3 mb-3" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-100 rounded-full w-16" />
            <div className="h-5 bg-gray-100 rounded-full w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-gray-200 rounded-xl" />
          <div className="h-10 w-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
      <div className="h-16 bg-gray-100 rounded-2xl" />
    </div>
  )
}

export default function FundGrid({ funds, isGrid, loading }) {
  if (loading) {
    return (
      <div className={isGrid
        ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-5'
        : 'flex flex-col gap-4'}>
        {Array.from({ length: 6 }).map((_, i) => (
          <FundSkeleton key={i} isGrid={isGrid} />
        ))}
      </div>
    )
  }

  if (!funds.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No funds found</h3>
        <p className="text-gray-400 font-medium">Try adjusting your filters or search terms.</p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isGrid ? 'grid' : 'list'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={isGrid
          ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-5'
          : 'flex flex-col gap-4'}>
        {funds.map((fund, i) => (
          <FundCard key={fund.id} fund={fund} index={i} isGrid={isGrid} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
