import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import FeaturedFund from '../components/FeaturedFund'
import TopFunds from '../components/TopFunds'
import HeatmapSection from '../components/HeatmapSection'
import WhyChoose from '../components/WhyChoose'
import FundMarketplace from '../components/FundMarketplace'
import InvestmentPhilosophy from '../components/InvestmentPhilosophy'
import InvestmentProcess from '../components/InvestmentProcess'
import Comparison from '../components/Comparison'
import TrustSection from '../components/TrustSection'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Blog from '../components/Blog'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import { fetchFundsList } from '../api/funds'

export default function Home() {
  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFunds() {
      try {
        const data = await fetchFundsList()
        setFunds(data || [])
      } catch (error) {
        console.error("Failed to load funds for Home page:", error)
      } finally {
        setLoading(false)
      }
    }
    loadFunds()
  }, [])

  const featuredFund = funds.length > 0 ? funds[0] : null;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        {!loading && featuredFund && <FeaturedFund fund={featuredFund} />}
        {!loading && funds.length > 0 && <TopFunds fundsData={funds} />}
        {!loading && funds.length > 0 && <HeatmapSection fundsData={funds} />}
        <WhyChoose />
        {!loading && funds.length > 0 && <FundMarketplace fundsData={funds} />}
        <InvestmentPhilosophy />
        <InvestmentProcess />
        <Comparison />
        <TrustSection />
        <Testimonials />
        <FAQ />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
