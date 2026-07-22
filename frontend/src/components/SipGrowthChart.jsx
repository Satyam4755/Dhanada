import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const fmt = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function SipGrowthChart({ yearlyData, inputs, results }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  const labels = yearlyData.map(d => `Y${d.year}`)
  const investedArr = yearlyData.map(d => Math.round(d.invested))
  const valueArr = yearlyData.map(d => Math.round(d.value))

  const data = {
    labels,
    datasets: [
      {
        label: 'Invested Amount',
        data: investedArr,
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148,163,184,0.08)',
        borderWidth: 2,
        borderDash: [5, 4],
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#94a3b8',
        pointHoverRadius: 6,
      },
      {
        label: 'Projected Value',
        data: valueArr,
        borderColor: '#032e92',
        backgroundColor: (ctx) => {
          const chart = ctx.chart
          const { ctx: c, chartArea } = chart
          if (!chartArea) return 'rgba(3,46,146,0.1)'
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(3,46,146,0.22)')
          gradient.addColorStop(1, 'rgba(3,46,146,0.01)')
          return gradient
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#032e92',
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#032e92',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: 'Poppins', size: 12, weight: '600' },
          padding: 24,
          color: '#64748b',
        },
      },
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
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#94a3b8',
          callback: v => fmt(v),
        },
        border: { display: false, dash: [4, 4] },
      },
    },
  }

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-sm" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">SIP Growth Projection</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">Final Value</p>
              <p className="text-lg font-bold text-[#032e92]">{fmt(results.futureValue || 0)}</p>
            </div>
          </div>

          <div className="h-72 md:h-96">
            {inView && <Line data={data} options={options} />}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
