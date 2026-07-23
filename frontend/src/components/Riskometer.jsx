import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { getRiskLevelConfig } from '../utils/risk'

export default function Riskometer({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const risk = getRiskLevelConfig(fund.riskLevel)

  // We have 5 segments. We'll draw an SVG semicircle.
  // viewBox="0 0 200 100"
  // Angles: 0 to 180 degrees.
  // 5 segments, so each is 36 degrees.
  
  const segments = [
    { label: 'Low', color: '#22c55e' }, // green-500
    { label: 'Low to Moderate', color: '#a3e635' }, // lime-400
    { label: 'Moderate', color: '#f59e0b' }, // amber-500
    { label: 'High', color: '#f97316' }, // orange-500
    { label: 'Very High', color: '#dc2626' } // red-600
  ]

  // Calculate needle rotation based on risk level.
  // level 1: center of segment 1 (18 deg)
  // level 2: center of segment 2 (18 + 36 = 54 deg)
  // ...
  // level i: 18 + (i-1)*36 degrees
  
  const levelNum = risk.level !== 'N/A' ? parseInt(risk.level, 10) : 3;
  const needleAngle = 18 + (levelNum - 1) * 36;
  
  // Convert angle (0 is left, 180 is right) for CSS rotate:
  // In our SVG, left is 180 and right is 0 if we draw arc, 
  // but let's just use CSS transform on the needle.
  // 0 degrees points straight left, 180 points straight right.

  return (
    <section className="scroll-mt-32 pt-8 border-t border-[#e8edf7]" id="riskometer" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-8 self-start">Risk-o-Meter</h2>

        <div className="relative w-64 h-32 md:w-80 md:h-40 flex justify-center items-end">
          {/* Semicircle arcs */}
          <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
            {segments.map((seg, i) => {
              // start angle: 180 - (i+1)*36
              // end angle: 180 - i*36
              // SVG arc math
              const r = 90;
              const cx = 100;
              const cy = 100;
              const startAngle = 180 - (i + 1) * 36;
              const endAngle = 180 - i * 36;
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = cx + r * Math.cos(startRad);
              const y1 = cy - r * Math.sin(startRad);
              const x2 = cx + r * Math.cos(endRad);
              const y2 = cy - r * Math.sin(endRad);
              
              const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
              
              const d = [
                'M', x1, y1,
                'A', r, r, 0, largeArcFlag, 1, x2, y2
              ].join(' ');

              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="20"
                  strokeLinecap="butt"
                />
              )
            })}

            {/* Needle */}
            {risk.level !== 'N/A' && (
              <g 
                style={{ 
                  transformOrigin: '100px 100px', 
                  transform: `rotate(${needleAngle}deg)`,
                  transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Needle points to the LEFT (180deg) when rotation is 0. 
                    So we draw the needle pointing left. */}
                <path d="M 100 95 L 20 100 L 100 105 Z" fill="#374151" />
                <circle cx="100" cy="100" r="8" fill="#1f2937" />
                <circle cx="100" cy="100" r="3" fill="#ffffff" />
              </g>
            )}
          </svg>
        </div>

        {/* Labels below the gauge */}
        <div className="mt-8 text-center flex flex-col items-center">
          <p className="text-xl font-black text-gray-900 uppercase tracking-widest">{risk.label}</p>
          <p className="text-sm font-semibold text-gray-500 mt-1">Risk Level {risk.level} of 5</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-dashed border-[#e8edf7] text-center w-full">
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Investors should consult their financial advisers if in doubt about whether the product is suitable for them. The Risk-o-meter is based on the scheme portfolio and is subject to periodic review and change.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
