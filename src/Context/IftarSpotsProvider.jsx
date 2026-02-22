import React, { useState, useEffect, useCallback } from 'react';
import { IftarSpotsContext } from './IftarSpotsContext';
import * as ifterspotApi from '../api/ifterspotApi';

const IftarSpotsProvider = ({ children }) => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ifterspotApi.getSpots();
      setSpots(data);
    } catch (err) {
      setError(err.message || 'ডেটা লোড হয়নি');
      setSpots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const addSpot = async (spot) => {
    const payload = {
      ...spot,
      items: Array.isArray(spot.items) && spot.items.length ? spot.items : (spot.item ? [spot.item] : []),
      likes: spot.likes || [],
      status: 'approved',
      roleAtCreation: 'user',
    };
    const created = await ifterspotApi.createSpot(payload);
    setSpots((prev) => [created, ...prev]);
    return created;
  };

  const updateSpot = async (spotId, data) => {
    const updated = await ifterspotApi.updateSpot(spotId, data);
    setSpots((prev) =>
      prev.map((s) => ((s._id || s.id) === spotId ? { ...s, ...updated } : s))
    );
    return updated;
  };

  const deleteSpot = async (spotId) => {
    await ifterspotApi.deleteSpot(spotId);
    setSpots((prev) => prev.filter((s) => (s._id || s.id) !== spotId));
  };

  const toggleLike = async (spotId, userId) => {
    if (!userId) return;
    try {
      const updated = await ifterspotApi.toggleLikeSpot(spotId, userId);
      if (updated) {
        setSpots((prev) =>
          prev.map((s) => ((s._id || s.id) === spotId ? { ...s, ...updated } : s))
        );
      }
    } catch {
      // ignore
    }
  };

  const value = {
    spots,
    setSpots,
    loading,
    error,
    fetchSpots,
    addSpot,
    updateSpot,
    deleteSpot,
    toggleLike,
  };

  return (
    <IftarSpotsContext.Provider value={value}>
      {children}
    </IftarSpotsContext.Provider>
  );
};

export default IftarSpotsProvider;
