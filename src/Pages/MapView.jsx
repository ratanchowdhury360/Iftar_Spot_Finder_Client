import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useIftarSpots } from '../Context/IftarSpotsContext';
import { mapLinkToCoords } from '../utils/mapLinkToCoords';
import { getItemLabel } from '../data/iftarItems';

const MapView = () => {
  const { spots } = useIftarSpots();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearMeLoading, setNearMeLoading] = useState(false);
  const [nearMeError, setNearMeError] = useState('');

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const spotsWithCoords = useMemo(() => {
    return spots
      .filter(
        (s) => s.mapLink && (!s.date || s.date >= todayStr)
      )
      .map((spot) => {
        const coords = mapLinkToCoords(spot.mapLink);
        return coords ? { ...spot, ...coords } : null;
      })
      .filter(Boolean);
  }, [spots, todayStr]);

  const filteredSpots = useMemo(() => {
    if (!searchQuery.trim()) return spotsWithCoords;
    const q = searchQuery.trim().toLowerCase();
    return spotsWithCoords.filter(
      (s) =>
        s.masjidName?.toLowerCase().includes(q) ||
        s.area?.toLowerCase().includes(q)
    );
  }, [spotsWithCoords, searchQuery]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !window.L || !mapRef.current) return;

    const L = window.L;
    const center = filteredSpots.length
      ? [
          filteredSpots.reduce((a, s) => a + s.lat, 0) / filteredSpots.length,
          filteredSpots.reduce((a, s) => a + s.lng, 0) / filteredSpots.length,
        ]
      : [23.8103, 90.4125];
    const zoom = filteredSpots.length ? 10 : 7;

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersRef.current = filteredSpots.map((spot) => {
      const marker = L.marker([spot.lat, spot.lng]).addTo(map);
      const dateStr = spot.date
        ? new Date(spot.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';
      const itemKey = spot.items?.[0] || spot.item;
      const itemName = itemKey ? getItemLabel(itemKey) : '';
      const popupContent = `
        <div class="text-left min-w-45">
          <p class="font-semibold text-base">🕌 ${spot.masjidName}</p>
          <p class="text-sm opacity-80">📍 ${spot.area}</p>
          ${itemName ? `<p class="text-xs opacity-70 mt-0.5">🍽 ${itemName}</p>` : ''}
          <p class="text-sm opacity-80">📅 ${dateStr}</p>
          ${spot.mapLink ? `<a href="${spot.mapLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm mt-2 block text-center">Open in Google Maps</a>` : ''}
        </div>
      `;
      marker.bindPopup(popupContent);
      return marker;
    });

    if (filteredSpots.length > 0) {
      const bounds = L.latLngBounds(filteredSpots.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    return () => {
      if (userMarkerRef.current) {
        try { map.removeLayer(userMarkerRef.current); } catch { /* ignore */ }
        userMarkerRef.current = null;
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mounted, filteredSpots]);

  const handleNearMe = () => {
    setNearMeError('');
    if (!navigator.geolocation) {
      setNearMeError('আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।');
      return;
    }
    setNearMeLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNearMeLoading(false);
        const map = mapInstanceRef.current;
        if (!map || !window.L) return;
        const L = window.L;
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 14, { duration: 0.8 });
        if (userMarkerRef.current) {
          try { map.removeLayer(userMarkerRef.current); } catch { /* ignore */ }
        }
        const userIcon = L.divIcon({
          className: 'near-me-marker',
          html: '<div style="width:24px;height:24px;background:#0d9488;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>আপনার লোকেশন</b>');
      },
      () => {
        setNearMeLoading(false);
        setNearMeError('লোকেশন পেতে পারছি না। ব্রাউজার থেকে লোকেশন অনুমতি দিন।');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-base-200/30 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/30">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-1">
          Map View
        </h1>
        <p className="text-base-content/70 mb-4">
          ইফতার স্পটগুলোর লোকেশন ম্যাপে পিন আকারে দেখানো হয়েছে। পিনে ক্লিক করে বিস্তারিত ও গুগল ম্যাপ লিংক পাবেন।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">🔍</span>
            <input
              type="text"
              placeholder="মসজিদ বা এলাকা দিয়ে খুঁজুন..."
              className="input input-bordered w-full pl-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleNearMe}
            disabled={nearMeLoading}
            className="btn btn-primary rounded-xl gap-2 whitespace-nowrap"
          >
            {nearMeLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <span>📍</span>
            )}
            Near me
          </button>
        </div>

        {nearMeError && (
          <div className="alert alert-warning text-sm rounded-xl mb-4">
            <span>{nearMeError}</span>
          </div>
        )}

        {searchQuery.trim() && (
          <p className="text-sm text-base-content/70 mb-2">
            {filteredSpots.length} টি স্পট খুঁজে পাওয়া গেছে
          </p>
        )}

        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200/60 overflow-hidden">
          <div
            ref={mapRef}
            className="h-[60vh] min-h-100 w-full rounded-2xl z-0"
            aria-label="Iftar spots map"
          />
          {spotsWithCoords.length === 0 && (
            <div className="p-6 text-center text-base-content/70">
              কোনো ইফতার স্পটের ম্যাপ লিংক নেই। Create Form থেকে স্পট যোগ করার সময় গুগল ম্যাপ লিংক দিন।
            </div>
          )}
          {spotsWithCoords.length > 0 && filteredSpots.length === 0 && (
            <div className="p-4 text-center text-base-content/70 text-sm">
              &quot;{searchQuery}&quot; এর সাথে মিলছে না। অন্য কিছু লিখে খুঁজুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
