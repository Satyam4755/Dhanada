import { createContext, useContext, useState } from 'react';
import LeadCaptureModal from '../components/LeadCaptureModal';

export const LeadModalContext = createContext();

export const useLeadModal = () => useContext(LeadModalContext);

export function LeadModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLeadModal = () => setIsOpen(true);
  const closeLeadModal = () => setIsOpen(false);

  return (
    <LeadModalContext.Provider value={{ isOpen, openLeadModal, closeLeadModal }}>
      {children}
      <LeadCaptureModal isOpen={isOpen} onClose={closeLeadModal} />
    </LeadModalContext.Provider>
  );
}
