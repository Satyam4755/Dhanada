import { motion } from 'framer-motion';

export default function CompareHero() {
  return (
    <section className="pt-24 pb-6 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] rounded-[2.5rem] p-6 lg:p-10 shadow-xl shadow-blue-900/5 border border-[#e8edf7] relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            
            {/* Text Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white/60 border border-blue-200 rounded-full px-3 py-1 text-[10px] lg:text-xs text-[#032e92] font-bold uppercase tracking-wide mb-4"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] animate-pulse" />
                Comparison Tool
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold text-[#1e293b] leading-tight mb-4 font-serif"
              >
                Compare Specialized <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032e92] to-[#c10000]">
                  Investment Funds
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[#64748b] text-sm lg:text-base font-medium leading-relaxed max-w-md"
              >
                Select up to 3 Specialized Investment Funds to compare returns, risk metrics, expense ratios, NAV performance, and portfolio allocation side-by-side.
              </motion.p>
            </div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block mx-auto"
            >
              <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl shadow-blue-900/10 border border-[#e8edf7] relative z-10 flex flex-col gap-3 scale-90 origin-right">
                
                {/* Mock Card 1 */}
                <motion.div 
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
                    <div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mb-2"></div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-12 h-4 bg-green-100 rounded-full"></div>
                </motion.div>

                {/* Mock Card 2 */}
                <motion.div 
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">B</div>
                    <div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full mb-2"></div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-12 h-4 bg-yellow-100 rounded-full"></div>
                </motion.div>
                
                {/* Mock Chart Area */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-end gap-2 h-20 px-2 justify-center">
                  <div className="w-4 bg-blue-200 rounded-t-sm h-[40%]" />
                  <div className="w-4 bg-red-200 rounded-t-sm h-[60%]" />
                  <div className="w-4 bg-blue-300 rounded-t-sm h-[70%]" />
                  <div className="w-4 bg-red-300 rounded-t-sm h-[50%]" />
                  <div className="w-4 bg-blue-500 rounded-t-sm h-[90%]" />
                  <div className="w-4 bg-red-500 rounded-t-sm h-[100%]" />
                </div>

              </div>

              {/* Floating Badge */}
              <motion.div 
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute -right-2 top-1/2 bg-white px-3 py-2 rounded-xl shadow-xl border border-[#e8edf7] flex items-center gap-2 z-20">
                  <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-[10px]">VS</span>
                  <div>
                    <span className="text-xs font-bold text-gray-700 block">Side-by-Side</span>
                    <span className="text-[10px] text-gray-500">Analytics</span>
                  </div>
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
