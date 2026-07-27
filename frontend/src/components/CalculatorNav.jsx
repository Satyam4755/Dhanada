import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CalculatorNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const calculators = [
    { name: 'SIP Calculator', path: '/calculators/sip' },
    { name: 'Step Up SIP', path: '/calculators/step-up-sip' },
    { name: 'SWP Calculator', path: '/calculators/swp' },
    { name: 'Lumpsum Calculator', path: '/calculators/lumpsum' },
    { name: 'Retirement Calculator', path: '/calculators/retirement' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="pt-5 border-t border-white/10"
    >
      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-3">Explore Calculators</p>
      
      <div className="flex overflow-x-auto pb-2 -mx-2 px-2 lg:mx-0 lg:px-0 lg:flex-wrap lg:overflow-visible gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {calculators.map((calc, i) => {
          const isActive = currentPath === calc.path;
          return (
            <Link
              key={i}
              to={calc.path}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-white text-[#032e92] shadow-md shadow-white/10' 
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              {calc.name}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
