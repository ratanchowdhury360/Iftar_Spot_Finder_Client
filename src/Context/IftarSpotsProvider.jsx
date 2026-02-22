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
      status: 'approved',
      roleAtCreation: 'user',
    };
    setSpots((prev) => [newSpot, ...prev]);
    return newSpot;
  };

  const updateSpot = (spotId, data) => {
    setSpots((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, ...data } : s))
    );
  };

  const deleteSpot = (spotId) => {
    setSpots((prev) => prev.filter((s) => s.id !== spotId));
  };

  const toggleLike = (spotId, userId) => {
    if (!userId) return;
    setSpots((prev) =>
      prev.map((s) => {
        if (s.id !== spotId) return s;
        const likes = Array.isArray(s.likes) ? [...s.likes] : [];
        const i = likes.indexOf(userId);
        if (i >= 0) likes.splice(i, 1);
        else likes.push(userId);
        return { ...s, likes };
      })
    );
  };

  const value = { spots, setSpots, addSpot, updateSpot, deleteSpot, toggleLike };
  return (
    <IftarSpotsContext.Provider value={value}>
      {children}
    </IftarSpotsContext.Provider>
  );
};

export default IftarSpotsProvider;
