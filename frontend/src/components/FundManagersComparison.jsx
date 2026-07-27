import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faBriefcase, faAward, faRankingStar } from '@fortawesome/free-solid-svg-icons';

export default function FundManagersComparison({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-6">Fund Management</h3>
      
      <div className={`grid gap-6 ${
        activeFunds.length === 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
        activeFunds.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
        'grid-cols-1 md:grid-cols-3'
      }`}>
        {activeFunds.map((fund, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 lg:p-8 border border-[#e8edf7] shadow-lg shadow-blue-900/5 group hover:border-[#032e92]/30 transition-colors h-full flex flex-col">
            
            <div className="flex flex-col items-center text-center border-b border-[#e8edf7] pb-6 mb-6">
              <img 
                src={fund.manager.image} 
                alt={fund.manager.name} 
                className="w-20 h-20 rounded-full border-4 border-[#eef4ff] mb-4 shadow-sm"
              />
              <h4 className="text-lg font-bold text-[#1e293b] mb-1 group-hover:text-[#032e92] transition-colors">{fund.manager.name}</h4>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{fund.name.substring(0, 20)}...</span>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#f7f9fc] text-[#032e92] flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faBriefcase} className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Experience</p>
                  <p className="text-sm font-semibold text-[#1e293b]">{fund.manager.experience}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#f7f9fc] text-[#032e92] flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faAward} className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Qualification</p>
                  <p className="text-sm font-semibold text-[#1e293b]">{fund.manager.qualification}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#f7f9fc] text-[#032e92] flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faRankingStar} className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Other Funds</p>
                  <p className="text-sm font-semibold text-[#1e293b]">{fund.manager.fundsManaged}</p>
                </div>
              </div>
            </div>

            <a 
              href={fund.manager.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#0a66c2] text-[#0a66c2] text-sm font-bold hover:bg-[#0a66c2] hover:text-white transition-all"
            >
              <FontAwesomeIcon icon={faLinkedin} className="text-base" /> View Profile
            </a>

          </div>
        ))}
      </div>
    </div>
  );
}
