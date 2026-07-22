import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faBell, faBars, faChevronDown, faXmark,
  faChartLine
} from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Funds', href: '/funds', dropdown: [
      { label: 'All Funds', href: '/funds' },
      { label: 'Top Performing', href: '/#top-funds' },
      { label: 'Fund Marketplace', href: '/#marketplace' },
      { label: 'Featured Fund', href: '/#featured' },
    ]
  },
  { label: 'Products', href: '/#products' },
  {
    label: 'Calculators', href: '/calculators/sip', dropdown: [
      { label: 'SIP Calculator', href: '/calculators/sip' },
      { label: 'Step Up SIP', href: '/calculators/step-up-sip' },
      { label: 'SWP Calculator', href: '/calculators/swp' },
      { label: 'Lumpsum Calculator', href: '/calculators/lumpsum' },
      { label: 'Retirement Calculator', href: '/calculators/retirement' },
    ]
  },
  { label: 'Research', href: '/#research' },
  { label: 'Blog', href: '/#blog' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-lg shadow-blue-900/10' : 'bg-white'
      }`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#032e92] to-[#0a4fd4] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faChartLine} className="text-white text-sm" />
            </div>
            <div>
              <span className="text-xl font-bold text-[#032e92]">SIF</span>
              <span className="text-xl font-bold text-[#c10000]">invest</span>
              <p className={`text-[9px] font-medium tracking-wider uppercase leading-none ${scrolled ? 'text-gray-400' : 'text-gray-300'
                }`}>Smart Investment Fund</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label} className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link to={link.href}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[#eef4ff] hover:text-[#032e92] ${location.pathname === link.href
                      ? 'bg-[#eef4ff] text-[#032e92] font-semibold'
                      : scrolled ? 'text-gray-700' : 'text-gray-800'
                    }`}>
                  {link.label}
                  {link.dropdown && (
                    <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''
                      }`} />
                  )}
                </Link>
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-2xl shadow-blue-900/15 border border-gray-100 py-2 overflow-hidden">
                        {link.dropdown.map((item) => (
                          <Link key={item.label} to={item.href}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#eef4ff] hover:text-[#032e92] transition-colors font-medium">
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-[#eef4ff] hover:text-[#032e92] ${scrolled ? 'text-gray-600' : 'text-gray-700'
              }`}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
            </button>
            <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-[#eef4ff] hover:text-[#032e92] ${scrolled ? 'text-gray-600' : 'text-gray-700'
              }`}>
              <FontAwesomeIcon icon={faBell} className="text-sm" />
            </button>
            <a href="#login" className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:shadow-md ${scrolled
                ? 'border-[#032e92] text-[#032e92] hover:bg-[#032e92] hover:text-white'
                : 'border-[#032e92] text-[#032e92] hover:bg-[#032e92] hover:text-white bg-white/80'
              }`}>
              Login
            </a>
            <a href="#invest" className="btn-ripple px-5 py-2 rounded-full text-sm font-semibold bg-[#032e92] text-white hover:bg-[#021d63] shadow-lg shadow-blue-900/30 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
              Invest Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#eef4ff] text-[#032e92]">
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white rounded-2xl mb-4 shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.label} to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#eef4ff] hover:text-[#032e92] transition-colors">
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 flex gap-3">
                  <a href="#login" className="flex-1 text-center py-2.5 rounded-xl border-2 border-[#032e92] text-[#032e92] text-sm font-semibold">Login</a>
                  <a href="#invest" className="flex-1 text-center py-2.5 rounded-xl bg-[#032e92] text-white text-sm font-semibold">Invest Now</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
