import React, { useMemo, useState } from 'react';
import IftarSpotCard from '../Components/IftarSpotCard';
import { useIftarSpots } from '../Context/IftarSpotsContext';

const ArchivedIftar = () => {
  const { spots } = useIftarSpots();
  const [likedIds, setLikedIds] = useState(() => new Set());

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const archivedSpots = useMemo(() => {
    return [...spots]
      .filter((s) => s.status === 'approved' && s.date && s.date < todayStr)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [spots, todayStr]);

  const handleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200/50 to-base-100">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
          Archived Iftar
        </h1>
        <p className="text-base-content/70 mb-8">
          যে ইফতার স্পটের তারিখ পার হয়ে গেছে সেগুলো এখানে দেখানো হয়েছে।
        </p>
        {archivedSpots.length === 0 ? (
          <div className="text-center py-16 bg-base-200/50 rounded-2xl">
            <p className="text-base-content/70">
              কোনো আর্কাইভ ইফতার স্পট নেই।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {archivedSpots.map((spot) => (
              <IftarSpotCard
                key={spot.id}
                spot={spot}
                onLike={handleLike}
                isLiked={likedIds.has(spot.id)}
                likeCount={
                  likedIds.has(spot.id)
                    ? (spot.likes?.length || 0) + 1
                    : spot.likes?.length || 0
                }
                showViewDetails
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedIftar;
