import React, { useMemo, useState, useContext } from 'react';
import IftarSpotCard from '../Components/IftarSpotCard';
import EditSpotModal from '../Components/EditSpotModal';
import { useIftarSpots } from '../Context/IftarSpotsContext';
import { AuthContext } from '../Context/AuthProvider';
import { isAdmin } from '../utils/constants';

const ArchivedIftar = () => {
  const { user } = useContext(AuthContext);
  const { spots, loading: spotsLoading, error: spotsError, toggleLike, updateSpot, deleteSpot } = useIftarSpots();
  const [editSpot, setEditSpot] = useState(null);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const archivedSpots = useMemo(() => {
    return [...spots]
      .filter((s) => s.date && s.date < todayStr)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [spots, todayStr]);

  const handleLike = (id) => toggleLike(id, user?.email);
  const handleDelete = (id) => deleteSpot(id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200/50 to-base-100">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
          Archived Iftar
        </h1>
        <p className="text-base-content/70 mb-8">
          যে ইফতার স্পটের তারিখ পার হয়ে গেছে সেগুলো এখানে দেখানো হয়েছে। এক্সপায়ার হওয়া স্পট ডিলিট করা যায় না।
        </p>
        {spotsError && (
          <div className="alert alert-error rounded-xl mb-6">
            <span>{spotsError}</span>
          </div>
        )}
        {spotsLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : archivedSpots.length === 0 ? (
          <p className="text-base-content/70">কোনো আর্কাইভড স্পট নেই।</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedSpots.map((spot) => (
              <IftarSpotCard
                key={spot._id || spot.id}
                spot={spot}
                currentUserId={user?.email}
                isAdmin={isAdmin(user)}
                isExpired
                onLike={handleLike}
                onEdit={setEditSpot}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
        {editSpot && (
          <EditSpotModal
            spot={editSpot}
            onClose={() => setEditSpot(null)}
            onSave={(id, data) => { updateSpot(id, data); setEditSpot(null); }}
          />
        )}
      </div>
    </div>
  );
};

export default ArchivedIftar;
