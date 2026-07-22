import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserTie, faBriefcase, faArrowTrendUp, faEnvelope,
  faGraduationCap, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

export default function FundManager({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const managers = fund.managers || []

  if (!managers || managers.length === 0) {
    return (
      <section id="fund-managers" className="scroll-mt-32">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-8 text-center">
          <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-3xl mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">Fund Manager Details Unavailable</h3>
          <p className="text-sm text-gray-500">Manager details are not available for this scheme.</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section id="fund-managers" className="scroll-mt-32 space-y-6">
      {managers.map((manager, idx) => (
        <motion.div
          key={idx}
          ref={idx === 0 ? ref : null}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
              <FontAwesomeIcon icon={faUserTie} className="text-[#032e92] text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Fund Manager {managers.length > 1 ? `#${idx + 1}` : ''}</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Manager Profile */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] rounded-2xl p-6 text-center border border-blue-100">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#032e92] to-[#0a4fd4] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {manager.initials}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{manager.name}</h3>
                <p className="text-xs font-semibold text-[#032e92] mb-3">{manager.designation}</p>

                {/* Stats */}
                <div className="bg-white rounded-xl p-3 mb-4 border border-blue-100">
                  <p className="text-2xl font-bold text-[#032e92]">{manager.experience}</p>
                  <p className="text-xs text-gray-500 font-medium">Industry Experience</p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-2">
                  <a href={manager.linkedin}
                    className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-[#032e92] hover:bg-[#032e92] hover:text-white hover:border-[#032e92] transition-all">
                    <FontAwesomeIcon icon={faLinkedin} className="text-sm" />
                  </a>
                  {manager.email && (
                    <a href={`mailto:${manager.email}`}
                      className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-[#032e92] hover:bg-[#032e92] hover:text-white hover:border-[#032e92] transition-all">
                      <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Manager Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Education */}
              <div className="flex items-start gap-3 bg-[#f7f9fc] rounded-2xl p-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-amber-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Education</p>
                  <p className="text-sm font-semibold text-gray-800">{manager.education}</p>
                </div>
              </div>

              {/* Specialization */}
              <div className="flex items-start gap-3 bg-[#f7f9fc] rounded-2xl p-4">
                <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faBriefcase} className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Specialization</p>
                  <p className="text-sm font-semibold text-gray-800">{manager.specialization}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] rounded-2xl p-5 border border-blue-100">
                <p className="text-sm font-medium text-gray-600 leading-relaxed">{manager.bio}</p>
              </div>

              {/* Other Funds */}
              {manager.fundsManaged?.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Other Funds Managed</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {manager.fundsManaged.map((f, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between bg-white border border-[#e8edf7] rounded-2xl px-4 py-3 hover:shadow-md hover:border-[#032e92]/30 transition-all cursor-pointer">
                        <div>
                          <p className="text-xs font-bold text-gray-800 line-clamp-1">{f.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{f.risk} Risk</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-green-600">{f.returns}</span>
                          <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 text-xs" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
