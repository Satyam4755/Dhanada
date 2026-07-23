import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine, faCalendar, faCoins, faPercent, faShieldHalved,
  faArrowTrendUp, faChartPie, faCircleCheck, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

function MetricCard({ icon, label, value, color, delay, iconBg }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl border border-[#e8edf7] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <FontAwesomeIcon icon={icon} className={`${color} text-sm`} />
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </motion.div>
  )
}

export default function OverviewSection({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const navigate = useNavigate()
  
  const formatPct = (val) => val === 'N/A' || val == null ? 'N/A' : `${val}%`
  const formatScore = (val) => val === 'N/A' || val == null ? 'N/A' : `${val}/10`

  const details = [
    { label: 'Scheme Type', value: fund.schemeType },
    { label: 'Category', value: fund.category },
    { label: 'Asset Class', value: fund.assetClass },
    { label: 'Benchmark', value: fund.benchmark },
    { label: 'Fund House', value: fund.amc },
    { label: 'Launch Date', value: fund.launchDate },
    { label: 'Fund Size (AUM)', value: fund.fundSize },
    { label: 'Expense Ratio', value: formatPct(fund.expenseRatio) },
    { label: 'NAV', value: fund.nav },
    { label: 'Min. SIP Amount', value: fund.minimumSIP },
    { label: 'Min. Lumpsum', value: fund.minimumLumpsum },
    { label: 'Exit Load', value: fund.exitLoad },
    { label: 'Face Value', value: fund.faceValue },
    { label: 'Registrar', value: fund.registrar },
    { label: 'Custodian', value: fund.custodian },
    { label: 'Auditor', value: fund.auditor },
  ]

  return (
    <section id="overview" className="scroll-mt-32">
      {/* Main Card */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8 mb-5">

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
            <FontAwesomeIcon icon={faCircleInfo} className="text-[#032e92] text-sm" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Fund Overview</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          {details.map((item) => (
            <div key={item.label} className="border-b border-dashed border-[#e8edf7] pb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{item.label}</p>
              <p className="text-sm font-bold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-[#e8edf7]">
          <button 
            onClick={() => {
              if (fund?.id) navigate(`/compare?primary=${fund.id}`)
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#032e92] text-white text-sm font-semibold hover:bg-[#021d63] shadow-md shadow-blue-900/20 transition-all">
            <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />
            Compare Fund
          </button>
          <button 
            onClick={() => {
              if (fund?.documents?.factsheet) {
                window.open(fund.documents.factsheet, '_blank')
              } else {
                alert('Factsheet is currently unavailable for this scheme.')
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#e8edf7] text-gray-600 text-sm font-semibold hover:border-[#032e92] hover:text-[#032e92] transition-all">
            <FontAwesomeIcon icon={faChartLine} className="text-xs" />
            Download Factsheet
          </button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard delay={0.1} icon={faCoins} label="Current NAV" value={fund.nav} color="text-[#032e92]" iconBg="bg-[#eef4ff]" />
        <MetricCard delay={0.2} icon={faPercent} label="Expense Ratio" value={formatPct(fund.expenseRatio)} color="text-purple-600" iconBg="bg-purple-50" />
        <MetricCard delay={0.3} icon={faArrowTrendUp} label="3Y CAGR" value={formatPct(fund.returns?.['3Y'])} color="text-green-600" iconBg="bg-green-50" />
        <MetricCard delay={0.4} icon={faShieldHalved} label="Risk Score" value={formatScore(fund.riskScore)} color="text-amber-600" iconBg="bg-amber-50" />
      </div>
    </section>
  )
}
