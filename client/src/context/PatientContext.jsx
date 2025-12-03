/**
 * PatientContext.jsx
 * -------------------
 * Holds shared patient-related UI state across the app.
 *
 * Current usage:
 * - Tracks `patientCount` for display inside the Navbar badge.
 * - Count is updated in Dashboard after loading patients from backend.
 *
 * Notes:
 * - Lightweight context used only for global counters.
 * - Can be extended later for selected patient, filters, etc.
 */

import { createContext, useContext, useState } from 'react';

const PatientContext = createContext(null);
export const usePatients = () => useContext(PatientContext);

export default function PatientProvider({ children }) {
  // Tracks total number of patients (shown in Navbar)
  const [patientCount, setPatientCount] = useState(0);

  return (
    <PatientContext.Provider value={{ patientCount, setPatientCount }}>
      {children}
    </PatientContext.Provider>
  );
}
