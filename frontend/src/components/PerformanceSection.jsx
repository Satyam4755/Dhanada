import { useState, useRef, useEffect } from 'react'
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
import PlanSelector from './PlanSelector'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const PERIODS = ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'Since Launch']

export default function PerformanceSection({ fund, planSelectorProps }) {
  const [activePeriod, setActivePeriod] = useState('1Y')
  const { ref, inView } = useInView({ triggerOnce: true })

  const perfData = fund.performanceData ? fund.performanceData[activePeriod] : null
  const hasChartData = perfData && perfData.labels && perfData.labels.length > 0;

  const chartData = hasChartData ? {
    labels: perfData.labels,
    datasets: [
      {
        label: fund.name,
        data: perfData.fund,
        borderColor: '#032e92',
        backgroundColor: 'rgba(3, 46, 146, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#032e92',
      },
      {
        label: fund.benchmark || 'Benchmark',
        data: perfData.bench || [],
        borderColor: '#c10000',
        backgroundColor: 'rgba(193, 0, 0, 0.04)',
        borderWidth: 2,
        borderDash: [5, 4],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#c10000',
      },
    ],
  } : null;

  const chartOptions = {
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
          padding: 20,
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
        padding: 12,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${typeof ctx.raw === 'number' ? ctx.raw.toFixed(2) : ctx.raw}`,
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
        grid: { color: '#f1f5f9', drawBorder: false },
        ticks: { font: { family: 'Poppins', size: 11 }, color: '#94a3b8' },
        border: { display: false, dash: [4, 4] },
      },
    },
  }

  const metrics = (fund.metrics && Object.keys(fund.metrics).length > 0) ? [
    { label: 'CAGR (3Y)', value: `${fund.metrics.cagr3Y}%`, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Volatility', value: `${fund.metrics.volatility}%`, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Sharpe Ratio', value: fund.metrics.sharpeRatio, color: 'text-[#032e92]', bg: 'bg-[#eef4ff]' },
    { label: 'Sortino Ratio', value: fund.metrics.sortinoRatio, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Alpha', value: `+${fund.metrics.alpha}%`, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Beta', value: fund.metrics.beta, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Std. Deviation', value: `${fund.metrics.standardDeviation}%`, color: 'text-rose-600', bg: 'bg-rose-50' },
  ] : []

  return (
    <section id="performance" className="scroll-mt-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
            <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-sm" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Performance</h2>
        </div>

        {planSelectorProps && (
          <PlanSelector {...planSelectorProps} fund={fund} className="mb-6 bg-gray-50" />
        )}

        {/* Period Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap mb-6">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activePeriod === p
                  ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                  : 'bg-[#f7f9fc] text-gray-500 border border-[#e8edf7] hover:border-[#032e92]/40 hover:text-[#032e92]'
              }`}>
              {p}
            </button>
          ))}
        </div>

        {/* Chart */}
        {hasChartData ? (
          <div className="h-64 md:h-80 mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="h-64 md:h-80 mb-8 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-400 font-medium text-sm">Time-series chart data is currently unavailable.</p>
          </div>
        )}

        {/* Performance Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#e8edf7] mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f9fc]">
                {['Period', 'Fund Return', 'Benchmark', 'Category Avg.', 'Difference'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf7]">
              {(fund.performanceTable || []).map((row, i) => (
                <tr key={i} className="hover:bg-[#f7f9fc] transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{row.period}</td>
                  <td className="px-4 py-3 font-bold text-green-600 whitespace-nowrap">{row.fund}</td>
                  <td className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{row.benchmark}</td>
                  <td className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{row.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      row.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{row.diff}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk Metrics Grid */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">Risk & Return Metrics</p>
          {(fund.metrics && Object.keys(fund.metrics).length > 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {metrics.map((m) => (
                <div key={m.label} className={`${m.bg} rounded-2xl p-3 text-center`}>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{m.label}</p>
                  <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
              <p className="text-gray-400 text-sm font-medium">Metrics unavailable</p>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
