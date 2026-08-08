import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function LeadCaptureModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setFormData({ full_name: '', email: '', phone: '' });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting' || status === 'success') return;

    setStatus('submitting');
    setErrorMessage('');

    if (!formData.email && !formData.phone) {
      setStatus('error');
      setErrorMessage('Please provide either your email address or phone number.');
      return;
    }

    try {
      const response = await fetch('/api/method/dhanada.api.create_website_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.message && data.message.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data?.message?.message || data?.exc_message || data?._server_messages || 'An error occurred while submitting your details. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={status === 'submitting' ? undefined : onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-[#f8fbff] to-white">
              <div>
                <h3 className="text-xl font-bold text-[#032e92]">Start Investing</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Leave your details and we'll help you get started.</p>
              </div>
              <button 
                onClick={onClose}
                disabled={status === 'submitting'}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-3xl mx-auto mb-4">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h4>
                  <p className="text-gray-500 text-sm font-medium">We've received your details. Our team will contact you shortly to complete your setup.</p>
                  <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 px-4 rounded-xl bg-[#032e92] text-white font-semibold hover:bg-[#021d63] transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
                      <FontAwesomeIcon icon={faCircleExclamation} className="mt-0.5 flex-shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input
                      required
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      pattern="[0-9]{10}"
                      title="10 digit mobile number"
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm disabled:bg-gray-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#032e92] text-white font-semibold shadow-lg shadow-blue-900/20 hover:bg-[#021d63] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        Submitting...
                      </>
                    ) : 'Get Started'}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 font-medium mt-3">
                    By submitting, you agree to our Terms & Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
