import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SwpHero from '../components/SwpHero'
import SwpCalculatorForm from '../components/SwpCalculatorForm'
import SwpSummaryCards from '../components/SwpSummaryCards'
import SwpGrowthChart from '../components/SwpGrowthChart'
import SwpProjectionTable from '../components/SwpProjectionTable'
import RecommendedFunds from '../components/RecommendedFunds'
import SwpFAQ from '../components/SwpFAQ'
import Newsletter from '../components/Newsletter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// ─── SWP Calculation ─────────────────────────────────────────────────────────
// Uses effective monthly rate: (1 + annual_rate)^(1/12) - 1
function getEffectiveMonthlyRate(annualReturn) {
  return Math.pow(1 + annualReturn / 100, 1 / 12) - 1
}

function calculateSWP(totalInvestment, withdrawalPerMonth, annualReturn, duration) {
  const r = getEffectiveMonthlyRate(annualReturn)
  const n = duration * 12

  let finalValue
  if (r === 0) {
    finalValue = totalInvestment - (withdrawalPerMonth * n)
  } else {
    // FV = P * (1+r)^n - W * [ ((1+r)^n - 1) / r ]
    const pGrowth = totalInvestment * Math.pow(1 + r, n)
    const wDeduction = withdrawalPerMonth * ((Math.pow(1 + r, n) - 1) / r)
    finalValue = pGrowth - wDeduction
  }

  const totalWithdrawal = withdrawalPerMonth * n

  return {
    totalInvestment,
    totalWithdrawal,
    finalValue: Math.max(0, finalValue), // Don't show negative final value
  }
}

function calculateYearlyData(totalInvestment, withdrawalPerMonth, annualReturn, duration) {
  const r = getEffectiveMonthlyRate(annualReturn)
  
  const getFV = (months) => {
    if (r === 0) return totalInvestment - (withdrawalPerMonth * months)
    const pGrowth = totalInvestment * Math.pow(1 + r, months)
    const wDeduction = withdrawalPerMonth * ((Math.pow(1 + r, months) - 1) / r)
    return pGrowth - wDeduction
  }

  const yearlyData = []
  for (let year = 1; year <= duration; year++) {
    const openingBalance = year === 1 ? totalInvestment : Math.max(0, getFV((year - 1) * 12))
    
    // If opening balance is 0, the fund is depleted
    if (openingBalance <= 0) break

    let closingBalance = getFV(year * 12)
    
    let actualWithdrawal = withdrawalPerMonth * 12
    if (closingBalance < 0) {
      // Adjust last year's withdrawal if fund depletes
      actualWithdrawal = openingBalance + (openingBalance * Math.pow(1 + r, 12) - openingBalance)
      closingBalance = 0
    }

    const interestEarned = closingBalance - openingBalance + actualWithdrawal

    yearlyData.push({
      year,
      openingBalance,
      totalWithdrawals: actualWithdrawal,
      interestEarned: Math.max(0, interestEarned), // Prevent weird negative precision errors
      closingBalance: Math.max(0, closingBalance)
    })
  }

  return yearlyData
}

const DEFAULT_INPUTS = {
  totalInvestment: 500000,
  withdrawalPerMonth: 10000,
  annualReturn: 8,
  duration: 5,
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
              The fund options shown for SWP on sMuse are illustrative and based on public information from AMCs and other third-party sources. We have not independently verified this information and it does not constitute investment, tax, legal, or financial advice or an offer to invest in any financial product. We are not advisors, distributors, or brokers. Before investing, review the official AMC documents and consult a qualified advisor. sMuse disclaims all liability for any loss arising from reliance on this information. Investment in Mutual Funds and Specialised Investment Funds (SIFs) are subject to market risks. Please read all scheme-related information before investing.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function SwpCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const handleReset = () => setInputs(DEFAULT_INPUTS)

  const results = useMemo(
    () => calculateSWP(inputs.totalInvestment, inputs.withdrawalPerMonth, inputs.annualReturn, inputs.duration),
    [inputs.totalInvestment, inputs.withdrawalPerMonth, inputs.annualReturn, inputs.duration]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(inputs.totalInvestment, inputs.withdrawalPerMonth, inputs.annualReturn, inputs.duration),
    [inputs.totalInvestment, inputs.withdrawalPerMonth, inputs.annualReturn, inputs.duration]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main>
        {/* Hero */}
        <SwpHero />

        {/* Calculator Form */}
        <SwpCalculatorForm inputs={inputs} setInputs={setInputs} onReset={handleReset} />

        {/* Summary Cards */}
        <SwpSummaryCards results={results} />

        {/* Growth Chart */}
        <SwpGrowthChart yearlyData={yearlyData} results={results} />

        {/* Projection Table — full width */}
        <SwpProjectionTable yearlyData={yearlyData} />

        {/* Recommended Funds */}
        <div className="pt-6">
          <RecommendedFunds inputs={inputs} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <SwpFAQ />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
