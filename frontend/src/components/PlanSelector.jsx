import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

export default function PlanSelector({
  availableTypes, availableOptions, availableSubOptions, availablePeriods,
  selectedType, selectedOption, selectedSubOption, selectedPeriod,
  setSelectedType, setSelectedOption, setSelectedSubOption, setSelectedPeriod,
  fund,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-2xl border border-[#e8edf7] shadow-sm p-4 flex flex-wrap items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm w-full md:w-auto">
        <FontAwesomeIcon icon={faFilter} />
        <span>Select Plan:</span>
      </div>
      
      {availableTypes && availableTypes.length > 0 && (
        <select 
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="bg-[#f7f9fc] border border-[#e8edf7] text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#032e92]">
          {availableTypes.map(t => <option key={t} value={t}>{t} Plan</option>)}
        </select>
      )}

      {availableOptions && availableOptions.length > 0 && (
        <select 
          value={selectedOption}
          onChange={e => setSelectedOption(e.target.value)}
          className="bg-[#f7f9fc] border border-[#e8edf7] text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#032e92]">
          {availableOptions.map(o => <option key={o} value={o}>{o} Option</option>)}
        </select>
      )}
      
      {availableSubOptions && availableSubOptions.length > 0 && (
        <select 
          value={selectedSubOption}
          onChange={e => setSelectedSubOption(e.target.value)}
          className="bg-[#f7f9fc] border border-[#e8edf7] text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#032e92]">
          <option value="">No Sub Option</option>
          {availableSubOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      {availablePeriods && availablePeriods.length > 0 && (
        <select 
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value)}
          className="bg-[#f7f9fc] border border-[#e8edf7] text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#032e92]">
          <option value="">No Period</option>
          {availablePeriods.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      )}
      
      {fund && (
        <div className="ml-auto text-xs text-gray-400 font-medium text-right w-full md:w-auto">
          ISIN: <span className="text-gray-700 font-bold">{fund.isin}</span><br />
          SIF: <span className="text-gray-700 font-bold">{fund.sifCode}</span>
        </div>
      )}
    </div>
  )
}
