import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SipHero from '../components/SipHero'
import SipCalculatorForm from '../components/SipCalculatorForm'
import SipSummaryCards from '../components/SipSummaryCards'
import SipGrowthChart from '../components/SipGrowthChart'
import SipProjectionTable from '../components/SipProjectionTable'
import InvestmentInsights from '../components/InvestmentInsights'
import RecommendedFunds from '../components/RecommendedFunds'
import SipFAQ from '../components/SipFAQ'
import Newsletter from '../components/Newsletter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// ─── SIP Calculation ─────────────────────────────────────────────────────────
// Uses effective monthly rate: (1 + annual_rate)^(1/12) - 1
// This matches standard Indian financial calculator results (e.g. Groww, ClearTax)
function getEffectiveMonthlyRate(annualReturn) {
  // Convert annual effective rate to effective monthly rate
  return Math.pow(1 + annualReturn / 100, 1 / 12) - 1
}

function calculateSIP(sipAmount, annualReturn, duration) {
  const r = getEffectiveMonthlyRate(annualReturn)
  const n = duration * 12
  const totalInvested = sipAmount * n

  let futureValue
  if (r === 0) {
    futureValue = totalInvested
  } else {
    // Annuity due (beginning of period): FV = P × [(1+r)^n - 1]/r × (1+r)
    futureValue = sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  }

  const wealthGained = futureValue - totalInvested
  const absoluteReturn = totalInvested > 0 ? (wealthGained / totalInvested) * 100 : 0

  return { futureValue, totalInvested, wealthGained, absoluteReturn }
}

function calculateYearlyData(sipAmount, annualReturn, duration) {
  const r = getEffectiveMonthlyRate(annualReturn)
  return Array.from({ length: duration }, (_, i) => {
    const year = i + 1
    const n = year * 12
    const invested = sipAmount * n
    let fv
    if (r === 0) {
      fv = invested
    } else {
      fv = sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    }
    const gain = fv - invested
    const returnPct = invested > 0 ? (gain / invested) * 100 : 0
    return { year, invested, value: fv, gain, returnPct }
  })
}

const DEFAULT_INPUTS = {
  sipAmount: 25000,
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
              The fund options shown for SIP and Max Profit on sMuse are illustrative and based on public information from AMCs and other third-party sources. We have not independently verified this information and it does not constitute investment, tax, legal, or financial advice or an offer to invest in any financial product. We are not advisors, distributors, or brokers. Before investing, review the official AMC documents and consult a qualified advisor. sMuse disclaims all liability for any loss arising from reliance on this information. Investment in Mutual Funds and Specialised Investment Funds (SIFs) are subject to market risks. SIP in SIF is available only to investors whose total investment in the fund is INR 10,00,000 or above. Please read all scheme-related information before investing.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function SipCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const handleReset = () => setInputs(DEFAULT_INPUTS)

  const results = useMemo(
    () => calculateSIP(inputs.sipAmount, inputs.annualReturn, inputs.duration),
    [inputs.sipAmount, inputs.annualReturn, inputs.duration]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(inputs.sipAmount, inputs.annualReturn, inputs.duration),
    [inputs.sipAmount, inputs.annualReturn, inputs.duration]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main>
        {/* Hero */}
        <SipHero />

        {/* Calculator Form */}
        <SipCalculatorForm inputs={inputs} setInputs={setInputs} onReset={handleReset} />

        {/* Summary Cards */}
        <SipSummaryCards results={results} />

        {/* Growth Chart */}
        <SipGrowthChart yearlyData={yearlyData} inputs={inputs} results={results} />

        {/* Projection Table — full width */}
        <SipProjectionTable yearlyData={yearlyData} />

        {/* Insights */}
        <div className="pt-6">
          <InvestmentInsights inputs={inputs} results={results} yearlyData={yearlyData} />
        </div>

        {/* Recommended Funds */}
        <div className="pt-6">
          <RecommendedFunds inputs={inputs} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <SipFAQ />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
