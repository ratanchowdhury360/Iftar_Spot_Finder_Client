import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import IftarSpotCard from '../Components/IftarSpotCard';
import { useIftarSpots } from '../Context/IftarSpotsContext';
import { IFTAR_ITEMS } from '../data/iftarItems';

const SORT_OPTIONS = [
  { value: 'date-asc', label: 'Date (নিকটতম প্রথম)' },
  { value: 'date-desc', label: 'Date (সবচেয়ে দূরে)' },
  { value: 'masjidName', label: 'Masjid Name (A-Z)' },
  { value: 'area', label: 'Area (A-Z)' },
  { value: 'item', label: 'Item' },
];

const Home = () => {
  const location = useLocation();
  const { spots } = useIftarSpots();
  const [sortBy, setSortBy] = useState('date-asc');
  const [search, setSearch] = useState('');
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [filterItem, setFilterItem] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [likedIds, setLikedIds] = useState(() => new Set());

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const filteredAndSorted = useMemo(() => {
    let list = [...spots].filter(
      (s) => s.status === 'approved' && (!s.date || s.date >= todayStr)
    );

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

  const hasActiveFilters =
    filterTodayOnly || filterItem !== '' || filterArea.trim() !== '';

  const clearFilters = () => {
    setFilterTodayOnly(false);
    setFilterItem('');
    setFilterArea('');
    setSearch('');
  };

  const handleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-base-200/50 to-base-100">
      {location.state?.iftarCreated && (
        <div className="container mx-auto max-w-4xl px-4 pt-4">
          <div className="alert alert-success rounded-xl shadow">
            <span>ইফতার স্পট জমা হয়েছে। অ্যাডমিন অ্যাপ্রুভ করলে হোমপেজে দেখাবে।</span>
          </div>
        </div>
      )}
      {/* 1️⃣ Compact Premium Hero Section */}
<section className="relative py-10 sm:py-12 px-4 overflow-hidden">
  <div
    className="absolute inset-0 opacity-20"
    style={{ background: 'var(--ramadan-gradient)' }}
  />

  <div className="relative container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8">

    {/* Left Content */}
    <div className="space-y-5">
      <h1 className="text-3xl sm:text-4xl font-bold text-base-content leading-tight">
        🌙 আপনার এলাকার ইফতার স্পট খুঁজুন সহজে
      </h1>

      <p className="text-base sm:text-lg text-base-content/80 max-w-lg">
        মসজিদের ইফতার সময়সূচি ও মেনু এক জায়গায়। প্রতিদিন আপডেট হওয়া তথ্য এখন হাতের নাগালে।
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          to="/create"
          className="btn bg-primary text-primary-content rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          👉 নতুন ইফতার স্পট যুক্ত করুন
        </Link>

        <Link
          to="/all"
          className="btn btn-outline rounded-xl"
        >
          সকল স্পট দেখুন
        </Link>
      </div>

      {/* Small Stats Row */}
      <div className="flex flex-wrap gap-6 pt-4 text-sm text-base-content/70">
        <span>🕌 {spots.length} Spot</span>
        <span>📍 {new Set(spots.map(s => s.area)).size} Area</span>
        <span>👥 Community Driven</span>
      </div>
    </div>

    {/* Right Decorative Card */}
    <div className="hidden lg:block">
      <div className="bg-base-100/80 backdrop-blur rounded-3xl shadow-xl p-8 border border-base-200">
        <h3 className="text-xl font-semibold mb-4">
          কেন ব্যবহার করবেন?
        </h3>
        <ul className="space-y-3 text-base-content/80">
          <li>✔ ইফতার মেনু এক নজরে</li>
          <li>✔ তারিখ অনুযায়ী সাজানো</li>
          <li>✔ পুরোনো স্পট স্বয়ংক্রিয়ভাবে আর্কাইভ</li>
          <li>✔ কমিউনিটি ভিত্তিক তথ্য</li>
        </ul>
      </div>
    </div>

  </div>
</section>


{/* 2️⃣ Feature / Welcome Section (Compact & Attractive) */}
<section className="container mx-auto max-w-6xl px-4 py-10">
  <div className="text-center mb-8">
    <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
      🤝 এটি একটি কমিউনিটি উদ্যোগ
    </h2>
    <p className="text-base-content/70 mt-2">
      আপনার এলাকার ইফতার তথ্য শেয়ার করে অন্যদের সাহায্য করুন।
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    <div className="bg-base-100 rounded-2xl p-6 shadow-md border border-base-200 hover:shadow-lg transition">
      <div className="text-3xl mb-3">🔍</div>
      <h3 className="font-semibold text-lg mb-2">সহজে খুঁজুন</h3>
      <p className="text-base-content/70 text-sm">
        আইটেম, এলাকা ও তারিখ অনুযায়ী দ্রুত ইফতার স্পট খুঁজে নিন।
      </p>
    </div>

    <div className="bg-base-100 rounded-2xl p-6 shadow-md border border-base-200 hover:shadow-lg transition">
      <div className="text-3xl mb-3">📅</div>
      <h3 className="font-semibold text-lg mb-2">তারিখ অনুযায়ী সাজানো</h3>
      <p className="text-base-content/70 text-sm">
        আজকের ইফতার আলাদা করে দেখুন এবং পুরোনো তথ্য আর্কাইভে সংরক্ষিত থাকবে।
      </p>
    </div>

    <div className="bg-base-100 rounded-2xl p-6 shadow-md border border-base-200 hover:shadow-lg transition">
      <div className="text-3xl mb-3">🗂</div>
      <h3 className="font-semibold text-lg mb-2">স্বয়ংক্রিয় আর্কাইভ</h3>
      <p className="text-base-content/70 text-sm">
        যেসব ইফতার শেষ হয়ে গেছে সেগুলো স্বয়ংক্রিয়ভাবে আর্কাইভে চলে যাবে।
      </p>
    </div>

  </div>
</section>

      {/* 3. Sort + Filter Section (redesigned) */}
      <section className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-base-200/60 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-base-content">
              🔽 Sort & 🔎 Filter
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-ghost btn-sm text-primary"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Single search + sort row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4">
            <div className="lg:col-span-5">
              <label className="label py-0">
                <span className="label-text">Search</span>
              </label>
              <input
                type="text"
                placeholder="Masjid or Area দিয়ে খুঁজুন..."
                className="input input-bordered w-full input-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="lg:col-span-4">
              <label className="label py-0">
                <span className="label-text">Sort by</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex items-end gap-2 flex-wrap">
              <label className="label cursor-pointer gap-2 flex-1 sm:flex-none">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={filterTodayOnly}
                  onChange={(e) => setFilterTodayOnly(e.target.checked)}
                />
                <span className="label-text whitespace-nowrap">Today only</span>
              </label>
            </div>
          </div>

          {/* Filter row: Item + Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div>
              <label className="label py-0">
                <span className="label-text">Item</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={filterItem}
                onChange={(e) => setFilterItem(e.target.value)}
              >
                <option value="">All items</option>
                {IFTAR_ITEMS.filter((i) => i.key !== 'others').map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label py-0">
                <span className="label-text">Area</span>
              </label>
              <input
                type="text"
                placeholder="Area..."
                className="input input-bordered input-sm w-full"
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Iftar Spot Cards */}
      <section className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-6">
          ইফতার স্পট
        </h2>
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-16 bg-base-200/50 rounded-2xl">
            <p className="text-base-content/70">
              কোনো ইফতার স্পট খুঁজে পাওয়া যাচ্ছে না। ফিল্টার পরিবর্তন করুন অথবা
              নতুন স্পট যোগ করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredAndSorted.map((spot) => (
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
      </section>
    </div>
  );
};

export default Home;
