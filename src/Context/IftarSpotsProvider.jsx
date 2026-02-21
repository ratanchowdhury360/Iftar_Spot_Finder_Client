import React, { useState } from 'react';
import { MOCK_IFTAR_SPOTS } from '../data/mockIftarSpots';
import { IftarSpotsContext } from './IftarSpotsContext';

const IftarSpotsProvider = ({ children }) => {
  const [spots, setSpots] = useState(MOCK_IFTAR_SPOTS);

  const addSpot = (spot) => {
    const newSpot = {
      ...spot,
      id: String(Date.now()),
      items: Array.isArray(spot.items) && spot.items.length ? spot.items : (spot.item ? [spot.item] : []),
      likes: spot.likes || [],
      status: spot.status ?? 'pending',
    };
    setSpots((prev) => [newSpot, ...prev]);
    return newSpot;
  };

  const value = { spots, setSpots, addSpot };
  return (
    <IftarSpotsContext.Provider value={value}>
      {children}
    </IftarSpotsContext.Provider>
  );
};

export default IftarSpotsProvider;
