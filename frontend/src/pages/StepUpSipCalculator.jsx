import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StepUpSipHero from '../components/StepUpSipHero'
import StepUpSipCalculatorForm from '../components/StepUpSipCalculatorForm'
import StepUpSipSummaryCards from '../components/StepUpSipSummaryCards'
import StepUpSipGrowthChart from '../components/StepUpSipGrowthChart'
import StepUpSipProjectionTable from '../components/StepUpSipProjectionTable'
import RecommendedFunds from '../components/RecommendedFunds'
import StepUpSipFAQ from '../components/StepUpSipFAQ'
import Newsletter from '../components/Newsletter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// ─── Step Up SIP Calculation ──────────────────────────────────────────────────
function calculateStepUpSip(monthlyInvestment, stepUpPercent, annualReturn, duration) {
  const r_eff = Math.pow(1 + annualReturn / 100, 1 / 12) - 1
  let totalInvested = 0
  let futureValue = 0

  for (let y = 1; y <= duration; y++) {
    // Current year's monthly investment
    const py = monthlyInvestment * Math.pow(1 + stepUpPercent / 100, y - 1)
    
    // Total invested in this year
    totalInvested += py * 12

    // Future value of this year's contributions at the end of the investment duration
    const months_left = 12 * (duration - y)
    const fvy = py * ((Math.pow(1 + r_eff, 12) - 1) / r_eff) * (1 + r_eff) * Math.pow(1 + r_eff, months_left)
    
    futureValue += fvy
  }

  const wealthGained = futureValue - totalInvested

  return {
    totalInvested,
    wealthGained,
    futureValue
  }
}

function calculateYearlyData(monthlyInvestment, stepUpPercent, annualReturn, duration) {
  const r_eff = Math.pow(1 + annualReturn / 100, 1 / 12) - 1
  const yearlyData = []
  
  let cumulativeInvested = 0
  let cumulativeValue = 0

  for (let y = 1; y <= duration; y++) {
    const py = monthlyInvestment * Math.pow(1 + stepUpPercent / 100, y - 1)
    const yearInvested = py * 12
    cumulativeInvested += yearInvested

    // Previous balance grows for 12 months
    cumulativeValue = cumulativeValue * Math.pow(1 + r_eff, 12)
    
    // New contributions for this year compound for up to 12 months
    const yearValue = py * ((Math.pow(1 + r_eff, 12) - 1) / r_eff) * (1 + r_eff)
    cumulativeValue += yearValue

    const gain = cumulativeValue - cumulativeInvested

    yearlyData.push({
      year: y,
      monthlySip: py,
      invested: cumulativeInvested,
      value: cumulativeValue,
      gain: Math.max(0, gain)
    })
  }

  return yearlyData
}

const DEFAULT_INPUTS = {
  monthlyInvestment: 25000,
  stepUp: 10,
  annualReturn: 12,
  duration: 10,
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
              The fund options shown for Step Up SIP on sMuse are illustrative and based on public information from AMCs and other third-party sources. We have not independently verified this information and it does not constitute investment, tax, legal, or financial advice or an offer to invest in any financial product. We are not advisors, distributors, or brokers. Before investing, review the official AMC documents and consult a qualified advisor. sMuse disclaims all liability for any loss arising from reliance on this information. Investment in Mutual Funds and Specialised Investment Funds (SIFs) are subject to market risks. Please read all scheme-related information before investing.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function StepUpSipCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const handleReset = () => setInputs(DEFAULT_INPUTS)

  const results = useMemo(
    () => calculateStepUpSip(inputs.monthlyInvestment, inputs.stepUp, inputs.annualReturn, inputs.duration),
    [inputs.monthlyInvestment, inputs.stepUp, inputs.annualReturn, inputs.duration]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(inputs.monthlyInvestment, inputs.stepUp, inputs.annualReturn, inputs.duration),
    [inputs.monthlyInvestment, inputs.stepUp, inputs.annualReturn, inputs.duration]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main>
        {/* Hero */}
        <StepUpSipHero />

        {/* Calculator Form */}
        <StepUpSipCalculatorForm inputs={inputs} setInputs={setInputs} onReset={handleReset} />

        {/* Summary Cards */}
        <StepUpSipSummaryCards results={results} />

        {/* Growth Chart */}
        <StepUpSipGrowthChart yearlyData={yearlyData} results={results} />

        {/* Projection Table — full width */}
        <StepUpSipProjectionTable yearlyData={yearlyData} />

        {/* Recommended Funds */}
        <div className="pt-6">
          <RecommendedFunds inputs={inputs} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <StepUpSipFAQ />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
