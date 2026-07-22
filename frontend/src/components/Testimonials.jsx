import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faQuoteLeft, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { testimonials } from '../data/data'

const avatarColors = ['from-blue-500 to-indigo-600', 'from-pink-500 to-rose-600', 'from-amber-500 to-orange-600', 'from-purple-500 to-violet-600', 'from-green-500 to-emerald-600']

export default function Testimonials() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="testimonials" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            💬 Testimonials
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Investors <span className="gradient-text">Are Saying</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Real investors. Real returns. Real stories of wealth creation with SIF.
          </p>
        </motion.div>

        {/* Swiper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}>
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12">
            {testimonials.map((t, i) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white rounded-3xl p-7 border border-[#e8edf7] shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full group relative overflow-hidden">
                  {/* Quote icon */}
                  <div className="absolute top-6 right-6 text-[#eef4ff]">
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-5xl" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <FontAwesomeIcon key={j} icon={faStar} className="text-amber-400 text-sm" />
                    ))}
                  </div>

                  <p className="text-gray-600 font-medium leading-relaxed text-sm mb-6 relative z-10">
                    "{t.review}"
                  </p>

                  {/* Returns Badge */}
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 w-fit mb-5">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-600 text-xs" />
                    <span className="text-xs font-bold text-green-700">+{t.returns} Returns</span>
                    <span className="text-xs text-gray-400 font-medium">on {t.invested}</span>
                  </div>

                  {/* Investor Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs font-medium">{t.profession}</p>
                    </div>
                  </div>

                  {/* Bottom accent on hover */}
                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#032e92] to-[#c10000] rounded-full mt-5 transition-all duration-500" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}
