import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      {/* Previous */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
          currentPage === 1
            ? 'border-[#e8edf7] text-gray-300 cursor-not-allowed'
            : 'border-[#e8edf7] text-gray-600 hover:border-[#032e92] hover:text-[#032e92] hover:bg-[#eef4ff]'
        }`}>
        <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
        Prev
      </motion.button>

      {/* Page Numbers */}
      {getPages().map((page, i) => (
        page === '...'
          ? <span key={`ellipsis-${i}`} className="px-2 text-gray-400 font-medium">...</span>
          : (
            <motion.button
              key={page}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                currentPage === page
                  ? 'bg-[#032e92] text-white shadow-lg shadow-blue-900/25'
                  : 'border-2 border-[#e8edf7] text-gray-600 hover:border-[#032e92] hover:text-[#032e92] hover:bg-[#eef4ff]'
              }`}>
              {page}
            </motion.button>
          )
      ))}

      {/* Next */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
          currentPage === totalPages
            ? 'border-[#e8edf7] text-gray-300 cursor-not-allowed'
            : 'border-[#e8edf7] text-gray-600 hover:border-[#032e92] hover:text-[#032e92] hover:bg-[#eef4ff]'
        }`}>
        Next
        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
      </motion.button>
    </div>
  )
}
