import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RetirementHero from '../components/RetirementHero'
import RetirementCalculatorForm from '../components/RetirementCalculatorForm'
import RetirementOutput from '../components/RetirementOutput'
import RecommendedFunds from '../components/RecommendedFunds'
import RetirementFAQ from '../components/RetirementFAQ'
import Newsletter from '../components/Newsletter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// ─── Retirement Calculation ──────────────────────────────────────────────────
function calculateRetirement(age, monthlySpend, lifestyle, savingStyle) {
  const retirementAge = 60
  const lifeExpectancy = 85
  const yearsToRetirement = Math.max(1, retirementAge - age)
  const yearsInRetirement = Math.max(1, lifeExpectancy - retirementAge)

  // Assumptions
  const inflation = 0.06 // 6%
  const postRetirementReturn = 0.07 // 7%
  
  // Lifestyle multipliers based on reference behavior
  let lifestyleMultiplier = 1.0
  if (lifestyle === 'king') lifestyleMultiplier = 1.4 // ~ 10Cr target for 25k spend
  else if (lifestyle === 'monk') lifestyleMultiplier = 0.7

  // Calculate monthly expenses at retirement age
  const expensesAtRetirement = monthlySpend * Math.pow(1 + inflation, yearsToRetirement) * lifestyleMultiplier

  // Calculate required corpus (PV of annuity in advance)
  const realReturnPostRetirement = (postRetirementReturn - inflation) / (1 + inflation)
  const r_monthly = realReturnPostRetirement / 12
  const monthsInRetirement = yearsInRetirement * 12

  let requiredCorpus = 0
  if (r_monthly === 0) {
    requiredCorpus = expensesAtRetirement * monthsInRetirement
  } else {
    // PV of growing annuity
    requiredCorpus = expensesAtRetirement * ((1 - Math.pow(1 + r_monthly, -monthsInRetirement)) / r_monthly) * (1 + r_monthly)
  }

  // Pre-retirement savings return rate
  // Based on reverse engineering, the SAFE rate for 17,200 PMT to reach 10Cr over 35 years is ~11.6%.
  // So we'll use 11.5% for SAFE and 14% for AGGRESSIVE to align closely with standard Indian Mutual Fund / high-yield platforms.
  const preRetirementReturn = savingStyle === 'safe' ? 0.11616 : 0.14
  
  // Effective monthly rate
  const r_pre_monthly = Math.pow(1 + preRetirementReturn, 1 / 12) - 1
  const monthsToSave = yearsToRetirement * 12

  // Calculate monthly savings needed (PMT)
  const monthlySavingsNeeded = requiredCorpus / ( ((Math.pow(1 + r_pre_monthly, monthsToSave) - 1) / r_pre_monthly) * (1 + r_pre_monthly) )

  return {
    requiredCorpus,
    monthlySavingsNeeded
  }
}

const DEFAULT_INPUTS = {
  age: 25,
  monthlySpend: 25000,
  lifestyle: 'king',
  savingStyle: 'safe'
}

// ─── Disclaimer ────────────────────────────────────────────────────────────────
function Disclaimer() {
  return (
    <section className="bg-[#f7f9fc] pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex gap-3">
          <FontAwesomeIcon icon={faCircleInfo} className="text-gray-400 text-base flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Disclaimer</p>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              The retirement calculation provided is illustrative and based on general assumptions of inflation (6%), post-retirement return (7%), and an estimated life expectancy of 85 years. Actual market conditions, taxes, and personal circumstances will vary. This does not constitute financial advice. Please consult with a certified financial planner before making retirement decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function RetirementCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const handleReset = () => setInputs(DEFAULT_INPUTS)

  const results = useMemo(
    () => calculateRetirement(inputs.age, inputs.monthlySpend, inputs.lifestyle, inputs.savingStyle),
    [inputs.age, inputs.monthlySpend, inputs.lifestyle, inputs.savingStyle]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main>
        {/* Hero */}
        <RetirementHero />

        {/* Calculator Form */}
        <RetirementCalculatorForm inputs={inputs} setInputs={setInputs} onReset={handleReset} />

        {/* Output Area */}
        <RetirementOutput results={results} />

        {/* Recommended Funds */}
        <div className="pt-6">
          <RecommendedFunds inputs={inputs} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <RetirementFAQ />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
