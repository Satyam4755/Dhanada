import { useState, useMemo } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleInfo, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function FundSelector({ selectedFunds, onFundSelect, onReset, availableFunds = [] }) {
  
  // Create options for react-select
  const options = useMemo(() => {
    return availableFunds.map(fund => ({
      value: fund.id,
      label: fund.name,
      category: fund.category
    }));
  }, [availableFunds]);

  const handleSelect = (index, selectedOption) => {
    if (onFundSelect) {
      onFundSelect(index, selectedOption ? selectedOption.value : null);
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  // Determine allowed category based on the first selected fund
  const firstSelectedFund = selectedFunds.find(f => f !== null);
  const allowedCategory = firstSelectedFund ? firstSelectedFund.category : null;

  // Custom styles for react-select to match the premium theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: '4px',
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#032e92' : '#e8edf7',
      backgroundColor: '#f7f9fc',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(3, 46, 146, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#032e92'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#032e92' : state.isFocused ? '#eef4ff' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#94a3b8',
      fontSize: '14px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1e293b',
      fontSize: '14px',
      fontWeight: '600'
    })
  };

  // Helper to get filtered options for a specific slot
  const getOptionsForSlot = (index) => {
    // If there's an allowed category and this slot is empty (or we want to change it)
    if (allowedCategory) {
      return options.filter(opt => opt.category === allowedCategory);
    }
    return options;
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-xl shadow-blue-900/10 border border-[#e8edf7] mb-12 relative z-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] font-serif mb-1">Select Funds</h2>
          <p className="text-[#64748b] text-sm font-medium">Choose up to 3 funds. Once the first fund is selected, the rest are restricted to the same category.</p>
        </div>
        {allowedCategory && (
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#032e92] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide">
            <FontAwesomeIcon icon={faCircleCheck} /> Same-category compare
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[0, 1, 2].map(index => {
          const currentFund = selectedFunds[index];
          const value = currentFund ? { value: currentFund.id, label: currentFund.name, category: currentFund.category } : null;
          
          return (
            <div key={index} className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-1">
                Fund {index + 1}
              </label>
              <Select
                value={value}
                onChange={(option) => handleSelect(index, option)}
                options={getOptionsForSlot(index)}
                styles={customStyles}
                placeholder="Search fund..."
                isClearable
                isSearchable
                noOptionsMessage={() => allowedCategory ? `Only ${allowedCategory} funds allowed` : "No funds found"}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-gradient-to-r from-[#032e92] to-[#0a4fd4] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          Compare
        </button>
        <button onClick={handleReset} className="bg-white text-[#1e293b] border border-[#e8edf7] px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}
