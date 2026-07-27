import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CompareHero from '../components/CompareHero';
import FundSelector from '../components/FundSelector';
import SelectedFundSummary from '../components/SelectedFundSummary';
import ComparisonTable from '../components/ComparisonTable';
import PerformanceChart from '../components/PerformanceChart';
import ReturnsCards from '../components/ReturnsCards';
import RiskComparison from '../components/RiskComparison';
import PortfolioComparison from '../components/PortfolioComparison';
import SectorAllocation from '../components/SectorAllocation';
import TopHoldingsTable from '../components/TopHoldingsTable';
import FundManagersComparison from '../components/FundManagersComparison';
import ProsConsSection from '../components/ProsConsSection';
import AIRecommendation from '../components/AIRecommendation';
import CompareRelatedFunds from '../components/CompareRelatedFunds';
import Newsletter from '../components/Newsletter';

import ErrorBoundary from '../components/ErrorBoundary';

export default function CompareFunds() {
  // Global state for selected funds (array of 3, null means empty slot)
  const [selectedFunds, setSelectedFunds] = useState([null, null, null]);
  const [activeCategory, setActiveCategory] = useState(null);

  // Update active category when funds change
  useEffect(() => {
    const firstFund = selectedFunds.find(f => f !== null);
    setActiveCategory(firstFund ? firstFund.category : null);
  }, [selectedFunds]);

  const hasFundsToCompare = selectedFunds.some(f => f !== null);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#f7f9fc] font-sans">
        <Helmet>
          <title>Compare Funds | SIF Platform</title>
          <meta name="description" content="Compare Specialized Investment Funds side-by-side to evaluate performance, risk, and portfolio allocation." />
        </Helmet>
        
        <Navbar />
        
        <main>
          <CompareHero />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10 relative z-20">
            
            <ErrorBoundary><FundSelector selectedFunds={selectedFunds} setSelectedFunds={setSelectedFunds} /></ErrorBoundary>

            {hasFundsToCompare ? (
              <div className="animate-in fade-in duration-500">
                <ErrorBoundary><SelectedFundSummary selectedFunds={selectedFunds} /></ErrorBoundary>
                <ErrorBoundary><ComparisonTable selectedFunds={selectedFunds} /></ErrorBoundary>
                <ErrorBoundary><PerformanceChart selectedFunds={selectedFunds} /></ErrorBoundary>
                <ErrorBoundary><ReturnsCards selectedFunds={selectedFunds} /></ErrorBoundary>
                
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                  <div className="lg:col-span-2">
                    <ErrorBoundary><RiskComparison selectedFunds={selectedFunds} /></ErrorBoundary>
                  </div>
                </div>

                <ErrorBoundary><PortfolioComparison selectedFunds={selectedFunds} /></ErrorBoundary>
                <ErrorBoundary><SectorAllocation selectedFunds={selectedFunds} /></ErrorBoundary>
                <ErrorBoundary><TopHoldingsTable selectedFunds={selectedFunds} /></ErrorBoundary>
                <ErrorBoundary><ProsConsSection selectedFunds={selectedFunds} /></ErrorBoundary>
                <ErrorBoundary><AIRecommendation selectedFunds={selectedFunds} /></ErrorBoundary>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl opacity-50">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1e293b] font-serif mb-2">No Funds Selected</h3>
                <p className="text-[#64748b] text-sm max-w-md mx-auto">Please search and select up to 3 funds from the dropdowns above to begin your side-by-side comparison.</p>
              </div>
            )}
            
          </div>
          
          <Newsletter />
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
