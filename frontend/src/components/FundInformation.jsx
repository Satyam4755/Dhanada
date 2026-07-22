import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLayerGroup, faBriefcase, faCalendar, faShieldHalved,
  faPercent, faCoins, faScaleBalanced, faMoneyBillTrendUp,
  faChartLine, faUsers, faBuildingColumns, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

export default function FundInformation({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  
  const mainManager = fund.managers && fund.managers.length > 0 ? fund.managers[0].name : 'N/A'
  const expRatio = fund.expenseRatio !== 'N/A' ? `${fund.expenseRatio}%` : 'N/A'

  const infoGroups = [
    {
      title: 'Scheme Details',
      icon: faLayerGroup,
      color: 'text-[#032e92]',
      bg: 'bg-[#eef4ff]',
      items: [
        { label: 'Scheme Name', value: fund.name },
        { label: 'Category', value: fund.category },
        { label: 'Asset Class', value: fund.assetClass },
        { label: 'Scheme Type', value: fund.schemeType },
        { label: 'Benchmark', value: fund.benchmark },
        { label: 'Investment Type', value: fund.investmentType },
      ],
    },
    {
      title: 'Fund House',
      icon: faBuildingColumns,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      items: [
        { label: 'AMC', value: fund.amc },
        { label: 'Fund Manager', value: mainManager },
        { label: 'Launch Date', value: fund.launchDate },
        { label: 'Fund Size (AUM)', value: fund.fundSize },
      ],
    },
    {
      title: 'Investment Details',
      icon: faMoneyBillTrendUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      items: [
        { label: 'Minimum SIP', value: fund.minimumSIP },
        { label: 'Minimum Lumpsum', value: fund.minimumLumpsum },
        { label: 'Expense Ratio', value: expRatio },
        { label: 'Exit Load', value: fund.exitLoad },
        { label: 'Dividend Option', value: fund.dividendOption },
        { label: 'Lock-in Period', value: fund.lockIn },
      ],
    },
    {
      title: 'Risk & Compliance',
      icon: faShieldHalved,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      items: [
        { label: 'Risk Level', value: fund.risk },
        { label: 'Settlement', value: fund.settlement },
        { label: 'Taxation', value: fund.taxation },
      ],
    },
  ]

  return (
    <section id="fund-details" className="scroll-mt-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
            <FontAwesomeIcon icon={faCircleInfo} className="text-[#032e92] text-sm" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Fund Details</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {infoGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: gi * 0.1, duration: 0.5 }}
              className="border border-[#e8edf7] rounded-2xl overflow-hidden">
              {/* Group Header */}
              <div className={`flex items-center gap-2.5 px-5 py-3.5 ${group.bg} border-b border-[#e8edf7]`}>
                <FontAwesomeIcon icon={group.icon} className={`${group.color} text-sm`} />
                <h3 className={`font-bold text-sm ${group.color}`}>{group.title}</h3>
              </div>
              {/* Items */}
              <div className="divide-y divide-[#e8edf7]">
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-start justify-between px-5 py-3 hover:bg-[#f7f9fc] transition-colors">
                    <p className="text-xs font-medium text-gray-400 flex-shrink-0 w-36">{item.label}</p>
                    <p className="text-xs font-bold text-gray-800 text-right">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
