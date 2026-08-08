import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Funds from './pages/Funds'
import FundDetails from './pages/FundDetails'
import CompareFunds from './pages/CompareFunds'
import SipCalculator from './pages/SipCalculator'
import SwpCalculator from './pages/SwpCalculator'
import LumpsumCalculator from './pages/LumpsumCalculator'
import StepUpSipCalculator from './pages/StepUpSipCalculator'
import RetirementCalculator from './pages/RetirementCalculator'
import ScrollToTop from './components/ScrollToTop'
import ChatbotWidget from './chatbot/components/ChatbotWidget'
import { LeadModalProvider } from './context/LeadModalContext'
import './index.css'

function App() {
  console.log("App Rendered");
  return (
    <LeadModalProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/funds/:id" element={<FundDetails />} />
          <Route path="/compare" element={<CompareFunds />} />
          <Route path="/calculators/sip" element={<SipCalculator />} />
          <Route path="/calculators/swp" element={<SwpCalculator />} />
          <Route path="/calculators/lumpsum" element={<LumpsumCalculator />} />
          <Route path="/calculators/step-up-sip" element={<StepUpSipCalculator />} />
          <Route path="/calculators/retirement" element={<RetirementCalculator />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </LeadModalProvider>
  )
}

export default App
