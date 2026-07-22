import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

// ─── Allocation Doughnut ───
export function AllocationChart({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const allocations = fund.allocations || []
  
  if (!allocations || allocations.length === 0) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 flex flex-col h-full items-center justify-center text-center">
        <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-3xl mb-3" />
        <h3 className="font-bold text-gray-900 mb-1">Asset Allocation Unavailable</h3>
        <p className="text-sm text-gray-500">Asset allocation data is not available for this scheme.</p>
      </motion.div>
    )
  }

  // Derive doughnut data from allocations array max limits
  const labels = allocations.map(a => a.name)
  const dataValues = allocations.map(a => a.max)
  const bgColors = ['#032e92', '#0a4fd4', '#60a5fa', '#bfdbfe', '#e0e7ff', '#c7d2fe']

  const data = {
    labels: labels,
    datasets: [{
      data: dataValues,
      backgroundColor: bgColors.slice(0, dataValues.length),
      borderColor: Array(dataValues.length).fill('#fff'),
      borderWidth: 3,
      hoverOffset: 8,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        display: false // We will use our own custom legend bars
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#e8edf7',
        borderWidth: 1,
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        bodyFont: { family: 'Poppins', size: 12 },
        callbacks: { label: ctx => ` ${ctx.label}: Max ${ctx.raw}%` },
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
          <FontAwesomeIcon icon={faChartPie} className="text-[#032e92] text-sm" />
        </div>
        <h3 className="font-bold text-gray-900">Asset Allocation Limits</h3>
      </div>
      
      <div className="h-56 relative">
        {inView && <Doughnut data={data} options={options} />}
      </div>
      
      {/* Allocation bars */}
      <div className="mt-4 space-y-3">
        {allocations.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1 text-xs">
             <div className="flex justify-between font-medium text-gray-700">
               <span className="truncate mr-2" title={item.name}>{item.name}</span>
               <span className="flex-shrink-0 text-gray-500">Min {item.min}% - Max {item.max}%</span>
             </div>
             <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
               <motion.div
                 initial={{ width: 0 }}
                 animate={inView ? { width: `${item.max}%` } : {}}
                 transition={{ duration: 1, delay: 0.3 }}
                 className="h-full rounded-full" 
                 style={{ backgroundColor: bgColors[idx % bgColors.length] }} />
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Sector Bar Chart ───
export function SectorChart({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  
  const sectors = fund.sectors || []

  if (!sectors || sectors.length === 0) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 flex flex-col h-full items-center justify-center text-center">
        <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-3xl mb-3" />
        <h3 className="font-bold text-gray-900 mb-1">Sector Allocation Unavailable</h3>
        <p className="text-sm text-gray-500">Sector allocation data is not available for this scheme.</p>
      </motion.div>
    )
  }

  const data = {
    labels: sectors.map(s => s.sector),
    datasets: [{
      label: 'Allocation %',
      data: sectors.map(s => s.weight),
      backgroundColor: [
        '#032e92', '#0a4fd4', '#2563eb', '#3b82f6',
        '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff',
      ],
      borderRadius: 6,
      borderSkipped: false,
    }],
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#e8edf7',
        borderWidth: 1,
        bodyFont: { family: 'Poppins', size: 12 },
        callbacks: { label: ctx => ` ${ctx.raw}%` },
      },
    },
    scales: {
      x: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { family: 'Poppins', size: 10 }, color: '#94a3b8', callback: v => `${v}%` },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { font: { family: 'Poppins', size: 11 }, color: '#64748b' },
        border: { display: false },
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
          <FontAwesomeIcon icon={faChartPie} className="text-purple-600 text-sm" />
        </div>
        <h3 className="font-bold text-gray-900">Sector Allocation</h3>
      </div>
      <div className="h-64">
        {inView && <Bar data={data} options={options} />}
      </div>
    </motion.div>
  )
}
