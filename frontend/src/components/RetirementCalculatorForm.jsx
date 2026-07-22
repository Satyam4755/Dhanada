import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalculator, faArrowRotateRight, faCircleInfo, faCheckCircle, faCircle
} from '@fortawesome/free-solid-svg-icons'

function InputField({ id, label, value, min, max, step = 1, onChange, hint, prefix }) {
  return (
    <div className="flex flex-col gap-1.5 mb-6">
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
          className={`w-full py-3.5 rounded-xl border-2 border-[#e8edf7] bg-[#f7f9fc] text-gray-800 font-bold text-base focus:outline-none focus:border-[#032e92] focus:ring-4 focus:ring-[#032e92]/8 transition-all ${prefix ? 'pl-8 pr-4' : 'px-4'}`}
        />
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
    </div>
  )
}

function RadioGroup({ label, options, selected, onChange }) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-3 w-full text-left p-3.5 rounded-xl border-2 transition-all ${isSelected ? 'border-[#032e92] bg-[#eef4ff]' : 'border-[#e8edf7] hover:border-[#032e92]/30 bg-white'}`}>
              <FontAwesomeIcon 
                icon={isSelected ? faCheckCircle : faCircle} 
                className={isSelected ? 'text-[#032e92]' : 'text-gray-300'} 
                style={{ fontSize: '18px' }}
              />
              <span className={`font-semibold text-sm ${isSelected ? 'text-[#032e92]' : 'text-gray-600'}`}>{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function RetirementCalculatorForm({ inputs, setInputs, onReset }) {
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#eef4ff] flex items-center justify-center">
                <FontAwesomeIcon icon={faCalculator} className="text-[#032e92] text-sm" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Retirement Calculator</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {/* Left Column */}
            <div>
              <InputField
                id="age"
                label="How old are you ?"
                value={inputs.age}
                min={18}
                max={60}
                step={1}
                onChange={v => handleChange('age', v)}
              />
              <InputField
                id="spend"
                label="How much do you spend per month?"
                prefix="₹"
                value={inputs.monthlySpend}
                min={5000}
                max={500000}
                step={1000}
                onChange={v => handleChange('monthlySpend', v)}
              />
            </div>

            {/* Right Column */}
            <div>
              <RadioGroup
                label="What kind of retirement you want?"
                options={[
                  { label: 'LIKE A KING', value: 'king' },
                  { label: 'I AM HAPPY THE WAY I AM', value: 'happy' },
                  { label: 'LIKE A MONK', value: 'monk' }
                ]}
                selected={inputs.lifestyle}
                onChange={v => handleChange('lifestyle', v)}
              />
              
              <RadioGroup
                label="Where are you saving for your retirement?"
                options={[
                  { label: 'SAFE (PF, FD, ETC)', value: 'safe' },
                  { label: 'AGGRESSIVE (MUTUAL FUNDS, EQUITY, ETC)', value: 'aggressive' }
                ]}
                selected={inputs.savingStyle}
                onChange={v => handleChange('savingStyle', v)}
              />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
