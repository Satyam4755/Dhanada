import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ProsConsSection({ selectedFunds }) {
  const activeFunds = selectedFunds.filter(f => f !== null);
  if (activeFunds.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-[#1e293b] font-serif mb-6">Pros & Cons</h3>
      
      <div className={`grid gap-6 ${
        activeFunds.length === 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
        activeFunds.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
        'grid-cols-1 md:grid-cols-3'
      }`}>
        {activeFunds.map((fund, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 lg:p-8 border border-[#e8edf7] shadow-lg shadow-blue-900/5 h-full flex flex-col">
            
            <h4 className="text-sm font-bold text-[#1e293b] mb-6 text-center border-b border-[#e8edf7] pb-4 truncate">
              {fund.name}
            </h4>

            <div className="flex-1 space-y-6">
              
              {/* Pros */}
              <div>
                <h5 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  Advantages
                </h5>
                <ul className="space-y-3">
                  {fund.pros.map((pro, i) => (
                    <li key={i} className="text-sm font-medium text-[#64748b] flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="pt-6 border-t border-[#e8edf7]">
                <h5 className="text-xs font-bold text-red-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                  Disadvantages
                </h5>
                <ul className="space-y-3">
                  {fund.cons.map((con, i) => (
                    <li key={i} className="text-sm font-medium text-[#64748b] flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span> {con}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
