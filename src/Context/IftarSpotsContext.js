import { createContext, useContext } from 'react';

export const IftarSpotsContext = createContext(null);

export const useIftarSpots = () => {
  const ctx = useContext(IftarSpotsContext);
  if (!ctx) throw new Error('useIftarSpots must be used inside IftarSpotsProvider');
  return ctx;
};
