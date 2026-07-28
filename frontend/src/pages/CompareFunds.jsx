import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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

import { fetchFundsList, fetchFundDetails } from '../api/funds';

function mapToPremiumFormat(apiFund, isBasicList = false) {
  if (!apiFund) return null;
  const plans = apiFund.plans || [];
  const selectedPlan = apiFund.defaultPlan || (plans.length > 0 ? plans[0] : {});
  const perf = selectedPlan?.performance_data || {};
  
  // Safe returns object
  const returns = {
    oneWeek: perf['1_week'] ? Number(perf['1_week']).toFixed(2) : 'N/A',
    oneMonth: perf['1_month'] ? Number(perf['1_month']).toFixed(2) : 'N/A',
    threeMonth: perf['3_months'] ? Number(perf['3_months']).toFixed(2) : 'N/A',
    sixMonth: perf['6_months'] ? Number(perf['6_months']).toFixed(2) : 'N/A',
    oneYear: perf['1_year'] ? Number(perf['1_year']).toFixed(2) : 'N/A',
    threeYear: perf['3_years'] ? Number(perf['3_years']).toFixed(2) : 'N/A',
    fiveYear: perf['5_years'] ? Number(perf['5_years']).toFixed(2) : 'N/A',
    sinceLaunch: perf['since_inception'] ? Number(perf['since_inception']).toFixed(2) : 'N/A',
  };

  const rawRisk = apiFund.riskometer_as_on_date || apiFund.riskometer_at_launch || apiFund.risk_level || apiFund.risk_band || apiFund.riskLevel || apiFund.risk;
  let riskNumeric = null;
  let riskLabel = "N/A";

  if (rawRisk && rawRisk !== 'N/A' && rawRisk !== 'None' && rawRisk !== 'null' && rawRisk !== 'undefined') {
    if (typeof rawRisk === 'string') {
      const match = rawRisk.match(/\d+/);
      if (match) {
        riskNumeric = parseInt(match[0], 10);
        if (riskNumeric > 5) riskNumeric = 5;
        if (riskNumeric < 1) riskNumeric = 1;
        riskLabel = `Level ${riskNumeric}`;
      } else {
        riskLabel = rawRisk;
        const lower = rawRisk.toLowerCase();
        if (lower.includes('very high')) riskNumeric = 5;
        else if (lower.includes('high')) riskNumeric = 4;
        else if (lower.includes('moderate')) riskNumeric = 3;
        else if (lower.includes('low')) riskNumeric = 1;
      }
    } else if (typeof rawRisk === 'number') {
      riskNumeric = rawRisk;
      if (riskNumeric > 5) riskNumeric = 5;
      if (riskNumeric < 1) riskNumeric = 1;
      riskLabel = `Level ${riskNumeric}`;
    }
  }

  // Exact same Asset Allocation mapping logic as FundDetails.jsx (Scheme Details)
  const rawAllocations = apiFund.allocations || apiFund.asset_allocation || apiFund.portfolio || [];
  let allocations = [];
  if (Array.isArray(rawAllocations)) {
    allocations = rawAllocations.map(a => ({
      name: a.type || a.instrument || a.asset_class || a.name || 'Unknown',
      min: a.min != null ? a.min : (a.min_allocation != null ? a.min_allocation : 0),
      max: a.max != null ? a.max : (a.max_allocation != null ? a.max_allocation : 0),
      value: a.value != null ? a.value : (a.max != null ? a.max : (a.max_allocation != null ? a.max_allocation : 0)),
    })).filter(a => a.name !== 'Unknown' || a.max > 0);
  } else if (rawAllocations && typeof rawAllocations === 'object') {
    allocations = Object.entries(rawAllocations).map(([k, v]) => ({
      name: k.charAt(0).toUpperCase() + k.slice(1),
      min: Number(v) || 0,
      max: Number(v) || 0,
      value: Number(v) || 0,
    })).filter(a => a.value > 0);
  }

  return {
    ...apiFund,
    id: apiFund.id || apiFund.name || 'unknown-id',
    name: apiFund.fund_name || apiFund.name || 'Unknown Fund',
    category: apiFund.category || 'Equity',
    subCategory: apiFund.subCategory || 'N/A',
    risk: riskLabel,
    riskNumeric: riskNumeric,
    nav: selectedPlan?.nav ? Number(selectedPlan.nav).toFixed(2) : 'N/A',
    aum: apiFund.aum || 'N/A',
    expenseRatio: apiFund.expenseRatio || 'N/A',
    returns,
    riskMetrics: apiFund.riskMetrics || {
      standardDeviation: 'N/A',
      beta: 'N/A',
      sharpeRatio: 'N/A',
      sortinoRatio: 'N/A',
      alpha: 'N/A'
    },
    benchmark: apiFund.benchmark || 'N/A',
    lockIn: apiFund.lockIn || 'None',
    exitLoad: apiFund.exitLoad || 'N/A',
    rating: apiFund.rating || 4,
    minSip: apiFund.minSip || 500,
    allocations,
    allocation: allocations,
    portfolio: allocations,
    sectors: apiFund.sectors || [],
    holdings: apiFund.holdings || apiFund.topHoldings || [],
    topHoldings: apiFund.topHoldings || apiFund.holdings || [],
    manager: apiFund.manager || (apiFund.managers && apiFund.managers[0]) || { name: 'Unknown Manager', experience: 'N/A', qualification: 'N/A', fundsManaged: 'N/A', linkedin: '#' },
    managers: apiFund.managers || [],
    pros: apiFund.pros || ["Strong long-term performance"],
    cons: apiFund.cons || ["Subject to market risks"],
    recommendations: apiFund.recommendations || []
  };
}

export default function CompareFunds() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allFunds, setAllFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([null, null, null]);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Load funds list on mount
  useEffect(() => {
    fetchFundsList().then(data => {
      const funds = Array.isArray(data) ? data : data.data || [];
      // Map the basic list to ensure CompareRelatedFunds gets the required structure
      const mappedList = funds.map(f => mapToPremiumFormat(f, true));
      setAllFunds(mappedList);
    }).catch(err => console.error("Failed to load funds list", err));
  }, []);

  // Sync selected funds from URL
  useEffect(() => {
    const compareIds = searchParams.getAll('compare');
    const newSelected = [null, null, null];
    let hasChanges = false;
    
    // We only take the first 3
    const idsToFetch = compareIds.slice(0, 3);
    
    const loadDetails = async () => {
      for (let i = 0; i < 3; i++) {
        const id = idsToFetch[i];
        const currentFund = selectedFunds[i];
        
        if (id) {
          if (!currentFund || currentFund.id !== id) {
            try {
              const detail = await fetchFundDetails(id);
              newSelected[i] = mapToPremiumFormat(detail);
              hasChanges = true;
            } catch (err) {
              console.error("Failed to fetch fund detail for", id, err);
            }
          } else {
            newSelected[i] = currentFund;
          }
        } else if (currentFund) {
          // It was removed from URL
          newSelected[i] = null;
          hasChanges = true;
        }
      }
      
      if (hasChanges) {
        setSelectedFunds(newSelected);
      }
    };
    
    loadDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    const firstFund = selectedFunds.find(f => f !== null);
    setActiveCategory(firstFund ? firstFund.category : null);
  }, [selectedFunds]);

  const handleFundSelect = useCallback((index, id) => {
    const compareIds = searchParams.getAll('compare');
    const newIds = [...compareIds];
    
    // ensure array is size 3
    while(newIds.length < 3) newIds.push('');
    
    newIds[index] = id || '';
    
    // clean up empty slots at the end or middle
    const finalIds = newIds.filter(Boolean);
    
    if (finalIds.length === 0) {
      setSearchParams({});
    } else {
      setSearchParams({ compare: finalIds });
    }
  }, [searchParams, setSearchParams]);

  const handleReset = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasFundsToCompare = selectedFunds.some(f => f !== null);

  useEffect(() => {
    document.title = "Compare Funds | SIF Platform";
  }, []);

  return (
      <div className="min-h-screen bg-[#f7f9fc] font-sans">
        
        <Navbar />
        
        <main>
          <CompareHero />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 lg:-mt-24 relative z-20">
            
            <FundSelector 
              selectedFunds={selectedFunds} 
              onFundSelect={handleFundSelect} 
              onReset={handleReset}
              availableFunds={allFunds} 
            />

            {hasFundsToCompare ? (
              <div className="animate-in fade-in duration-500">
                <SelectedFundSummary selectedFunds={selectedFunds} />
                <ComparisonTable selectedFunds={selectedFunds} />
                <PerformanceChart selectedFunds={selectedFunds} />
                <ReturnsCards selectedFunds={selectedFunds} />
                
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                  <div className="lg:col-span-2">
                    <RiskComparison selectedFunds={selectedFunds} />
                  </div>
                </div>

                <PortfolioComparison selectedFunds={selectedFunds} />
                {/* TODO:
                    Re-enable Sector Allocation comparison once Frappe provides complete
                    sector allocation data for all Specialized Investment Funds.
                <SectorAllocation selectedFunds={selectedFunds} /> 
                */}
                {/* TODO:
                    Re-enable Top 10 Holdings once portfolio holdings
                    become available from the Frappe backend.
                <TopHoldingsTable selectedFunds={selectedFunds} />
                */}
                {/* TODO:
                    Re-enable Pros & Cons once dynamic analysis
                    is generated from actual scheme data or AI insights.
                <ProsConsSection selectedFunds={selectedFunds} />
                */}
                <AIRecommendation selectedFunds={selectedFunds} />
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
            
            <CompareRelatedFunds selectedCategory={activeCategory} allFundsList={allFunds} />
            
          </div>
          
          <Newsletter />
        </main>

        <Footer />
      </div>
  );
}
