/* eslint-disable react-hooks/preserve-manual-memoization */
import React, { useMemo, useState, useContext } from 'react';
import { Link } from 'react-router';
import IftarSpotCard from '../Components/IftarSpotCard';
import EditSpotModal from '../Components/EditSpotModal';
import { useIftarSpots } from '../Context/IftarSpotsContext';
import { AuthContext } from '../Context/AuthProvider';
import { isAdmin } from '../utils/constants';

const MySpots = () => {
  const { user } = useContext(AuthContext);
  const { spots, loading: spotsLoading, error: spotsError, toggleLike, updateSpot, deleteSpot } = useIftarSpots();
  const [editSpot, setEditSpot] = useState(null);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const mySpots = useMemo(() => {
    if (!user?.email) return [];
    return [...spots].filter(
      (s) => s.createdByEmail === user.email || s.createdBy === user.email
    ).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [spots, user?.email]);

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-base-content/70 mb-4">আপনার স্পট দেখতে লগইন করুন।</p>
        <Link to="/login" className="btn btn-primary rounded-xl">লগইন</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-base-200/50 to-base-100">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
          My Created Spots
        </h1>
        <p className="text-base-content/70 mb-8">
          আপনি যে ইফতার স্পটগুলো তৈরি করেছেন ({mySpots.length} টি)। এডিট বা (তারিখ পার না হলে) ডিলিট করতে পারবেন।
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
        ) : null}
        {!spotsLoading && editSpot && (
          <EditSpotModal
            spot={editSpot}
            onClose={() => setEditSpot(null)}
            onSave={(id, data) => { updateSpot(id, data); setEditSpot(null); }}
          />
        )}
        {!spotsLoading && mySpots.length === 0 ? (
          <div className="text-center py-16 bg-base-200/50 rounded-2xl">
            <p className="text-base-content/70 mb-4">আপনি এখনও কোনো ইফতার স্পট তৈরি করেননি।</p>
            <Link to="/create" className="btn btn-primary rounded-xl">নতুন স্পট যোগ করুন</Link>
          </div>
        ) : !spotsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {mySpots.map((spot) => (
              <IftarSpotCard
                key={spot._id || spot.id}
                spot={spot}
                currentUserId={user?.email}
                isAdmin={isAdmin(user)}
                isExpired={spot.date && spot.date < todayStr}
                onLike={(id) => toggleLike(id, user?.email)}
                onEdit={setEditSpot}
                onDelete={deleteSpot}
                showViewDetails
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MySpots;
