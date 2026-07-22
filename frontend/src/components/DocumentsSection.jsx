import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilePdf, faDownload, faEye, faFileArrowDown, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

const docTypeColors = {
  'Factsheet': 'bg-blue-50 border-blue-100 text-blue-700',
  'SID': 'bg-purple-50 border-purple-100 text-purple-700',
  'KIM': 'bg-green-50 border-green-100 text-green-700',
  'SAI': 'bg-amber-50 border-amber-100 text-amber-700',
}

const docTitles = {
  factsheet: 'Scheme Factsheet',
  kim: 'Key Information Memorandum (KIM)',
  sai: 'Statement of Additional Information (SAI)',
  isid: 'Scheme Information Document (SID)'
}

const docTypes = {
  factsheet: 'Factsheet',
  kim: 'KIM',
  sai: 'SAI',
  isid: 'SID'
}

export default function DocumentsSection({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  // Convert the documents object into an array of document objects
  const availableDocs = Object.entries(fund.documents || {})
    .filter(([key, url]) => url)
    .map(([key, url]) => ({
      type: docTypes[key] || 'Document',
      name: docTitles[key] || key.toUpperCase(),
      url: url,
      date: 'Latest',
      size: 'PDF'
    }))

  if (availableDocs.length === 0) {
    return (
      <section id="documents" className="scroll-mt-32">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-8 text-center">
          <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-3xl mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">Documents Unavailable</h3>
          <p className="text-sm text-gray-500">No regulatory documents are currently available for this scheme.</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section id="documents" className="scroll-mt-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
            <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-sm" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Documents</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableDocs.map((doc, i) => {
            const style = docTypeColors[doc.type] || 'bg-gray-50 border-gray-100 text-gray-700'
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="group border border-[#e8edf7] rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 hover:border-[#032e92]/20 cursor-pointer">

                {/* PDF Icon */}
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${style}`}>
                  <FontAwesomeIcon icon={faFilePdf} className="text-xl" />
                </div>

                {/* Type badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style} mb-2 inline-block`}>
                  {doc.type}
                </span>

                {/* Name */}
                <p className="text-sm font-bold text-gray-800 leading-snug mb-1 group-hover:text-[#032e92] transition-colors line-clamp-2">
                  {doc.name}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mb-4">{doc.date} • {doc.size}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <a href={doc.url} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#032e92] text-white text-xs font-semibold hover:bg-[#021d63] transition-all shadow-sm shadow-blue-900/20">
                    <FontAwesomeIcon icon={faDownload} className="text-[10px]" />
                    Download
                  </a>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="w-9 h-8 flex items-center justify-center rounded-xl border border-[#e8edf7] text-gray-500 hover:border-[#032e92] hover:text-[#032e92] transition-all">
                    <FontAwesomeIcon icon={faEye} className="text-xs" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
