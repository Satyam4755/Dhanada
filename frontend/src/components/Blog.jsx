import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { blogs } from '../data/data'

const bgGradients = [
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-rose-600 to-pink-700',
]

const emojis = ['📈', '💹', '🏦']

export default function Blog() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="blog" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-3">
              📰 Latest Insights
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              Investment <span className="gradient-text">Research & Blog</span>
            </h2>
          </div>
          <a href="#all-blogs" className="flex items-center gap-2 text-[#032e92] font-semibold hover:gap-3 transition-all border border-[#032e92] px-5 py-2.5 rounded-full hover:bg-[#032e92] hover:text-white transition-colors duration-200">
            All Articles <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </motion.div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden cursor-pointer">
              
              {/* Image placeholder */}
              <div className={`relative h-52 bg-gradient-to-br ${bgGradients[i]} overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl opacity-20">{emojis[i]}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full text-xs font-semibold text-white">
                    {blog.category}
                  </span>
                </div>

                {/* Read time */}
                <div className="absolute bottom-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                    {blog.readTime}
                  </span>
                </div>

                {/* Zoom effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[i]} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-3">
                  <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                  {blog.date}
                  <span className="text-gray-200">•</span>
                  <span>{blog.author}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-tight mb-3 group-hover:text-[#032e92] transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-5 line-clamp-2">
                  {blog.description}
                </p>

                <a href={`#blog-${blog.id}`} className="flex items-center gap-2 text-[#032e92] font-semibold text-sm hover:gap-3 transition-all">
                  Read More <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
