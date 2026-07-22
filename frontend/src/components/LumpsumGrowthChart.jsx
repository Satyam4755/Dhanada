import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie, faChartLine } from '@fortawesome/free-solid-svg-icons'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend, ArcElement
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement)

const fmt = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function LumpsumGrowthChart({ yearlyData, results }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  // Data for Line Chart
  const labels = yearlyData.map(d => `Y${d.year}`)
  const investedArr = yearlyData.map(d => Math.round(d.invested))
  const valueArr = yearlyData.map(d => Math.round(d.value))

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Total Value',
        data: valueArr,
        borderColor: '#16a34a',
        backgroundColor: (ctx) => {
          const chart = ctx.chart
          const { ctx: c, chartArea } = chart
          if (!chartArea) return 'rgba(22,163,74,0.1)'
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(22,163,74,0.2)')
          gradient.addColorStop(1, 'rgba(22,163,74,0.01)')
          return gradient
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#16a34a',
        pointHoverRadius: 7,
      },
      {
        label: 'Invested Amount',
        data: investedArr,
        borderColor: '#93c5fd',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#e8edf7',
        borderWidth: 1,
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        bodyFont: { family: 'Poppins', size: 12 },
        titleFont: { family: 'Poppins', size: 12, weight: '700' },
        padding: 14,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Poppins', size: 11 }, color: '#94a3b8' },
        border: { display: false },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { family: 'Poppins', size: 11 }, color: '#94a3b8', callback: v => fmt(v) },
        border: { display: false, dash: [4, 4] },
      },
    },
  }

  // Data for Doughnut Chart
  const doughnutData = {
    labels: ['Invested amount', 'Est. returns'],
    datasets: [
      {
        data: [results.totalInvested, results.wealthGained],
        backgroundColor: ['#e0e7ff', '#4f46e5'], // Light purple and deep purple
        hoverBackgroundColor: ['#c7d2fe', '#4338ca'],
        borderWidth: 0,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          font: { family: 'Poppins', size: 12, weight: '600' },
          color: '#64748b',
          padding: 20
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#e8edf7',
        borderWidth: 1,
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        bodyFont: { family: 'Poppins', size: 12 },
        padding: 12,
        callbacks: {
          label: ctx => ` ${ctx.label}: ${fmt(ctx.raw)}`,
        },
      },
    },
  }

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Doughnut Chart (1/3 width on LG) */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8 flex flex-col">
            
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartPie} className="text-purple-600 text-sm" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Distribution</h2>
            </div>
            
            <div className="flex-1 relative min-h-[250px]">
              {inView && <Doughnut data={doughnutData} options={doughnutOptions} />}
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-8">
                <p className="text-xs font-semibold text-gray-400">Total Value</p>
                <p className="text-xl font-bold text-[#032e92]">{fmt(results.futureValue || 0)}</p>
              </div>
            </div>
          </motion.div>

          {/* Line Chart (2/3 width on LG) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8 flex flex-col">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-sm" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Wealth Projection</h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-3 h-1 rounded-full bg-[#93c5fd]" /> Invested
                </div>
                <div className="flex items-center gap-1.5 text-gray-900">
                  <span className="w-3 h-1 rounded-full bg-[#16a34a]" /> Total Value
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[250px]">
              {inView && <Line data={lineData} options={lineOptions} />}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
