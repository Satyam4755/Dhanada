import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CompareRelatedFunds({ selectedCategory, allFundsList = [] }) {
  // If no category is selected, just show all funds, otherwise filter by category
  const fundsToShow = selectedCategory
    ? allFundsList.filter(f => f.category === selectedCategory)
    : allFundsList;

  // We need at least a few to show, if filtering resulted in < 4, just mix in some others
  let displayFunds = [...fundsToShow];
  if (displayFunds.length < 4) {
    const others = allFundsList.filter(f => !displayFunds.find(df => df.id === f.id));
    displayFunds = [...displayFunds, ...others].slice(0, 5);
  }

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#1e293b] font-serif">Similar Funds You May Like</h2>
        <button className="text-[#032e92] font-semibold hover:text-[#c10000] transition-colors flex items-center gap-2">
          View All <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="pb-12 !px-2"
      >
        {displayFunds.map((fund, index) => (
          <SwiperSlide key={index} className="py-2">
            <div className="bg-white rounded-3xl p-6 border border-[#e8edf7] shadow-lg shadow-blue-900/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 group h-full flex flex-col">

              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#eef4ff] text-[#032e92] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {fund.category}
                </span>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${fund.risk === 'Low' ? 'bg-green-100 text-green-700' :
                    fund.risk === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                  {fund.risk} Risk
                </span>
              </div>

              <h3 className="font-bold text-[#1e293b] text-base leading-tight mb-4 group-hover:text-[#032e92] transition-colors flex-1">
                {fund.name}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">3Y Return</p>
                  <p className="text-sm font-bold text-green-600">{fund.returns.threeYear || fund.returns.sinceLaunch}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">NAV</p>
                  <p className="text-sm font-bold text-[#1e293b]">₹ {fund.nav}</p>
                </div>
              </div>

              <Link
                to={`/funds/${encodeURIComponent(fund.id || fund.name)}`}
                className="w-full bg-[#f7f9fc] text-[#032e92] border border-[#e8edf7] py-2.5 rounded-xl text-sm font-bold group-hover:bg-[#032e92] group-hover:text-white transition-colors text-center block"
              >
                View Details
              </Link>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
