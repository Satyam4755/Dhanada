import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalculator, faArrowRotateRight, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

function InputField({ id, label, prefix, suffix, value, min, max, step = 1, onChange, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
        {label}
        {hint && (
          <span title={hint} className="cursor-help">
            <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-xs" />
          </span>
        )}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-sm font-bold text-gray-500 pointer-events-none z-10">{prefix}</span>
        )}
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          className={`w-full py-3.5 rounded-xl border-2 border-[#e8edf7] bg-[#f7f9fc] text-gray-800 font-bold text-base focus:outline-none focus:border-[#032e92] focus:ring-4 focus:ring-[#032e92]/8 transition-all placeholder-gray-400 ${prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'}`}
        />
        {suffix && (
          <span className="absolute right-3.5 text-sm font-bold text-gray-500 pointer-events-none">{suffix}</span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer mt-1"
      />
      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
        <span>{prefix}{min?.toLocaleString()}{suffix}</span>
        <span>{prefix}{max?.toLocaleString()}{suffix}</span>
      </div>
    </div>
  )
}

export default function LumpsumCalculatorForm({ inputs, setInputs, onReset }) {
  const handleChange = (key, val) => setInputs(prev => ({ ...prev, [key]: val }))

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-blue-900/8 border border-[#e8edf7] p-6 lg:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#eef4ff] flex items-center justify-center">
                <FontAwesomeIcon icon={faCalculator} className="text-[#032e92] text-sm" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Lumpsum Calculator</h2>
                <p className="text-xs text-gray-400 font-medium">Results update instantly as you type</p>
              </div>
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#c10000] hover:text-[#9d0000] transition-colors px-3 py-1.5 rounded-xl border border-red-100 hover:bg-red-50">
              <FontAwesomeIcon icon={faArrowRotateRight} className="text-xs" />
              Reset
            </button>
          </div>

          {/* Main Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <InputField
              id="total-investment"
              label="Total investment"
              prefix="₹"
              value={inputs.totalInvestment}
              min={500}
              max={50000000}
              step={1000}
              onChange={v => handleChange('totalInvestment', v)}
              hint="One-time amount you want to invest"
            />
            <InputField
              id="annual-return"
              label="Expected return rate (p.a)"
              suffix="%"
              value={inputs.annualReturn}
              min={1}
              max={30}
              step={0.5}
              onChange={v => handleChange('annualReturn', v)}
              hint="Historical large cap average: 12–15% p.a."
            />
            <InputField
              id="duration"
              label="Time period"
              suffix=" Yr"
              value={inputs.duration}
              min={1}
              max={40}
              step={1}
              onChange={v => handleChange('duration', v)}
              hint="Duration for which you want to hold the investment"
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#e8edf7]">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="sm:flex-1 py-3.5 rounded-2xl bg-[#032e92] text-white font-bold text-sm hover:bg-[#021d63] shadow-lg shadow-blue-900/25 transition-all flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faCalculator} />
              Calculate Lumpsum
            </motion.button>
            <button
              onClick={onReset}
              className="sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-[#e8edf7] text-gray-500 font-semibold text-sm hover:border-[#032e92] hover:text-[#032e92] transition-all">
              Reset Values
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
