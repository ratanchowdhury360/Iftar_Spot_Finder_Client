/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import IftarSpotCard from '../Components/IftarSpotCard';
import EditSpotModal from '../Components/EditSpotModal';
import ReviewCard from '../Components/ReviewCard';
import { useIftarSpots } from '../Context/IftarSpotsContext';
import { AuthContext } from '../Context/AuthProvider';
import { isAdmin } from '../utils/constants';
import { IFTAR_ITEMS } from '../data/iftarItems';
import * as reviewApi from '../api/reviewApi';

const CARDS_PER_PAGE = 15;
const REVIEWS_PER_PAGE = 6;

const SORT_OPTIONS = [
  { value: 'date-asc', label: 'Date (নিকটতম প্রথম)' },
  { value: 'date-desc', label: 'Date (সবচেয়ে দূরে)' },
  { value: 'masjidName', label: 'Masjid Name (A-Z)' },
  { value: 'area', label: 'Area (A-Z)' },
  { value: 'item', label: 'Item' },
];

const Home = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { spots, loading: spotsLoading, error: spotsError, toggleLike, updateSpot, deleteSpot } = useIftarSpots();
  const [sortBy, setSortBy] = useState('date-asc');
  const [search, setSearch] = useState('');
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [filterItem, setFilterItem] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [editSpot, setEditSpot] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const activeSpots = useMemo(
    () => spots.filter((s) => !s.date || s.date >= todayStr),
    [spots, todayStr]
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError('');
        const data = await reviewApi.getAllReviews();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setReviewsError('রিভিউ লোড করা যাচ্ছে না। পরে আবার চেষ্টা করুন।');
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let list = [...spots].filter((s) => !s.date || s.date >= todayStr);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.masjidName?.toLowerCase().includes(q) ||
          s.area?.toLowerCase().includes(q)
      );
    }
    if (filterTodayOnly) list = list.filter((s) => s.date === todayStr);
    if (filterItem)
      list = list.filter((s) => s.items && s.items.includes(filterItem));
    if (filterArea)
      list = list.filter((s) =>
        s.area?.toLowerCase().includes(filterArea.trim().toLowerCase())
      );

    if (sortBy === 'date-asc')
      list.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    if (sortBy === 'date-desc')
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (sortBy === 'masjidName')
      list.sort((a, b) =>
        (a.masjidName || '').localeCompare(b.masjidName || '')
      );
    if (sortBy === 'area')
      list.sort((a, b) => (a.area || '').localeCompare(b.area || ''));
    if (sortBy === 'item')
      list.sort((a, b) => {
        const ai = (a.items && a.items[0]) || '';
        const bi = (b.items && b.items[0]) || '';
        return ai.localeCompare(bi);
      });

    return list;
  }, [
    spots,
    sortBy,
    search,
    filterTodayOnly,
    filterItem,
    filterArea,
    todayStr,
  ]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / CARDS_PER_PAGE));
  // Clamp page when results shrink (e.g. after filter change)
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedSpots = useMemo(() => {
    const start = (safePage - 1) * CARDS_PER_PAGE;
    return filteredAndSorted.slice(start, start + CARDS_PER_PAGE);
  }, [filteredAndSorted, safePage]);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
      ),
    [reviews],
  );

  const totalReviewItems = sortedReviews.length;
  const totalReviewPages = Math.max(1, Math.ceil(totalReviewItems / REVIEWS_PER_PAGE));
  const safeReviewPage = Math.min(Math.max(1, currentReviewPage), totalReviewPages);
  const paginatedReviews = useMemo(() => {
    const start = (safeReviewPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [sortedReviews, safeReviewPage]);

  const handleAdminDeleteReview = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'নিশ্চিত কি?',
      text: 'এই রিভিউ ডিলিট করলে এটি চিরতরে মুছে যাবে।',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
      cancelButtonText: 'বাতিল',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed) return;
    try {
      await reviewApi.deleteReview(id);
      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
      await Swal.fire({
        icon: 'success',
        title: 'সফল!',
        text: 'রিভিউ ডিলিট হয়েছে।',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: 'ঠিক আছে',
      });
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'দুঃখিত!',
        text: 'রিভিউ ডিলিট করা যায়নি। পরে আবার চেষ্টা করুন।',
        confirmButtonText: 'ঠিক আছে',
      });
    }
  };

  const hasActiveFilters =
    filterTodayOnly || filterItem !== '' || filterArea.trim() !== '';

  const clearFilters = () => {
    setFilterTodayOnly(false);
    setFilterItem('');
    setFilterArea('');
    setSearch('');
    setCurrentPage(1);
  };

  const handleLike = (id) => toggleLike(id, user?.email);
  const handleSaveEdit = async (id, data) => {
    await updateSpot(id, data);
    setEditSpot(null);
    await Swal.fire({
      icon: 'success',
      title: 'সফল!',
      text: 'ইফতার স্পট সফলভাবে আপডেট হয়েছে।',
      confirmButtonText: 'ঠিক আছে',
      timer: 2000,
      timerProgressBar: true,
    });
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'নিশ্চিত কি?',
      text: 'ইফতার স্পট ডিলিট করলে এটি চিরতরে মুছে যাবে।',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
      cancelButtonText: 'বাতিল',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed) return;
    await deleteSpot(id);
    await Swal.fire({
      icon: 'success',
      title: 'সফল!',
      text: 'ইফতার স্পট সফলভাবে ডিলিট হয়েছে।',
      confirmButtonText: 'ঠিক আছে',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-base-200/50 to-base-100">
      {location.state?.iftarCreated && (
        <div className="container mx-auto max-w-4xl px-4 pt-4">
          <div className="alert alert-success rounded-xl shadow">
            <span>ইফতার স্পট যোগ হয়েছে।</span>
          </div>
        </div>
      )}
      {editSpot && (
        <EditSpotModal
          spot={editSpot}
          onClose={() => setEditSpot(null)}
          onSave={async (id, data) => {
            await handleSaveEdit(id, data);
          }}
        />
      )}
{/* 1️⃣ Ultra Compact Hero Section */}
<section className="relative py-4 px-4 overflow-hidden">
  <div
    className="absolute inset-0 opacity-10"
    style={{ background: 'var(--ramadan-gradient)' }}
  />

  <div className="relative container mx-auto max-w-6xl text-center space-y-6">
    <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
      🌙 আপনার এলাকার ইফতার স্পট দেখুন
    </h1>

    <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto">
      মসজিদের ইফতার মেনু, তারিখ ও লোকেশন সহজে দেখুন — এবং নিজের এলাকার তথ্য যোগ করুন।
    </p>

    <div className="flex justify-center gap-3 flex-wrap">
      <Link
        to="/create"
        className="btn btn-primary rounded-xl shadow-md"
      >
        ➕ ইফতার স্পট যোগ করুন
      </Link>

    </div>

    {/* Mini Stats (non-expired spots only) */}
    <div className="flex justify-center gap-6 pt-4 text-sm text-base-content/60">
      <span>🕌 {activeSpots.length} Spot</span>
      <span>📍 {new Set(activeSpots.map((s) => s.area)).size} Area</span>
      <span>❤️ Community Driven</span>
    </div>
  </div>
</section>



{/* 2️⃣ Minimal Welcome Section */}
<section className="container mx-auto max-w-6xl px-4 pb-10">
  <div className="bg-base-100 border border-base-200 rounded-2xl shadow-sm p-6 text-center">
    <h2 className="text-xl sm:text-2xl font-semibold mb-3">
      🤝 এটি একটি কমিউনিটি উদ্যোগ
    </h2>

    <p className="text-base-content/70 max-w-xl mx-auto text-sm sm:text-base">
      আপনার এলাকার ইফতার তথ্য শেয়ার করুন এবং অন্যদের সাহায্য করুন। 
      প্রতিদিন আপডেট হওয়া তথ্য এখন সবার জন্য উন্মুক্ত।
    </p>
  </div>
</section>


      {/* 3. Sort + Filter Section (redesigned) */}
      <section className="container mx-auto max-w-6xl px-4 py-6">
  <div className="bg-base-100/70 backdrop-blur rounded-3xl shadow-sm border border-base-200 p-5 space-y-5">

    {/* Top Row */}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-base sm:text-lg font-semibold">
        🔍 Filter Iftar Spots
      </h3>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:underline"
        >
          Reset All
        </button>
      )}
    </div>

    {/* Search + Today */}
    <div className="flex flex-col sm:flex-row gap-3">

      {/* Search */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Masjid বা Area দিয়ে খুঁজুন..."
          className="input input-bordered w-full rounded-xl"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Today Only Toggle */}
      <label className="flex items-center gap-2 px-4 rounded-xl border border-base-300 cursor-pointer hover:bg-base-200 transition">
        <input
          type="checkbox"
          className="toggle toggle-primary toggle-sm"
          checked={filterTodayOnly}
          onChange={(e) => { setFilterTodayOnly(e.target.checked); setCurrentPage(1); }}
        />
        <span className="text-sm">Today Only</span>
      </label>

    </div>

    {/* Item + Area Filters (Pill Style) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

      {/* Item */}
      <select
        className="select select-bordered rounded-xl"
        value={filterItem}
        onChange={(e) => { setFilterItem(e.target.value); setCurrentPage(1); }}
      >
        <option value="">🍽 All Items</option>
        {IFTAR_ITEMS.filter((i) => i.key !== 'others').map((item) => (
          <option key={item.key} value={item.key}>
            {item.label}
          </option>
        ))}
      </select>

      {/* Area */}
      <input
        type="text"
        placeholder="📍 Filter by Area"
        className="input input-bordered rounded-xl"
        value={filterArea}
        onChange={(e) => { setFilterArea(e.target.value); setCurrentPage(1); }}
      />

    </div>

  </div>
</section>

      {/* 4. Iftar Spot Cards */}
      <section className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-6">
          ইফতার স্পট 
        </h2>
        {spotsError && (
          <div className="alert alert-error rounded-xl mb-6">
            <span>{spotsError}</span>
          </div>
        )}
        {spotsLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-16 bg-base-200/50 rounded-2xl">
            <p className="text-base-content/70">
              কোনো ইফতার স্পট খুঁজে পাওয়া যাচ্ছে না। ফিল্টার পরিবর্তন করুন অথবা
              নতুন স্পট যোগ করুন।
            </p>
          </div>
        ) : (
          <>
            <p className="text-base-content/70 mb-4">
              দেখাচ্ছি {((safePage - 1) * CARDS_PER_PAGE) + 1}–{Math.min(safePage * CARDS_PER_PAGE, totalItems)} (মোট {totalItems} স্পট)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedSpots.map((spot) => (
                <IftarSpotCard
                  key={spot._id || spot.id}
                  spot={spot}
                  currentUserId={user?.email}
                  isAdmin={isAdmin(user)}
                  isExpired={spot.date && spot.date < todayStr}
                  onLike={handleLike}
                  onEdit={setEditSpot}
                  onDelete={handleDelete}
                  showViewDetails
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  ← আগে
                </button>
                <span className="px-4 py-2 text-sm text-base-content/80">
                  পেজ {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  পরের →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 5. Review Section (before footer) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-6 lg:px-8 pb-10 sm:pb-12 md:pb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-base-content">ব্যবহারকারীদের রিভিউ</h2>
          {user && (
            <Link to="/my-review" className="btn btn-sm btn-outline rounded-xl">
              ✍️ আপনার রিভিউ দিন
            </Link>
          )}
        </div>

        {reviewsError && (
          <div className="alert alert-error rounded-xl mb-4 text-sm">
            <span>{reviewsError}</span>
          </div>
        )}

        {reviewsLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : sortedReviews.length === 0 ? (
          <p className="text-base-content/70 text-sm">
            এখনও কোনো রিভিউ নেই। প্রথম রিভিউটি দিতে পারেন আপনি।
          </p>
        ) : (
          <>
            <p className="text-base-content/70 text-sm mb-3">
              দেখাচ্ছি {((safeReviewPage - 1) * REVIEWS_PER_PAGE) + 1}–{Math.min(safeReviewPage * REVIEWS_PER_PAGE, totalReviewItems)} (মোট {totalReviewItems} রিভিউ)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {paginatedReviews.map((review) => (
                <ReviewCard
                  key={review._id || review.id}
                  review={review}
                  variant="compact"
                  showAdminDelete={isAdmin(user)}
                  onAdminDelete={handleAdminDeleteReview}
                />
              ))}
            </div>
            {totalReviewPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  disabled={safeReviewPage <= 1}
                  onClick={() => setCurrentReviewPage((p) => Math.max(1, p - 1))}
                >
                  ← আগে
                </button>
                <span className="px-4 py-2 text-sm text-base-content/80">
                  পেজ {safeReviewPage} / {totalReviewPages}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  disabled={safeReviewPage >= totalReviewPages}
                  onClick={() => setCurrentReviewPage((p) => Math.min(totalReviewPages, p + 1))}
                >
                  পরের →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
