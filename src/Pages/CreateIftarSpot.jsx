import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../Context/AuthProvider';
import { useIftarSpots } from '../Context/IftarSpotsContext';
import { IFTAR_ITEMS } from '../data/iftarItems';

const CreateIftarSpot = () => {
  const { user, loading } = useContext(AuthContext);
  const { addSpot } = useIftarSpots();
  const navigate = useNavigate();

  const [masjidName, setMasjidName] = useState('');
  const [area, setArea] = useState('');
  const [areaDetail, setAreaDetail] = useState('');
  const [date, setDate] = useState('');
  const [item, setItem] = useState('');
  const [othersText, setOthersText] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showOthersInput = item === 'others';

  if (!loading && !user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200/60 p-8 text-center">
          <span className="text-4xl" aria-hidden>🔐</span>
          <h1 className="text-xl font-bold text-base-content mt-4">লগইন প্রয়োজন</h1>
          <p className="text-base-content/70 mt-2">
            ইফতার স্পট নিবন্ধন করতে লগইন করুন। লগইন ছাড়া ফর্ম সাবমিট করা যাবে না।
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/login" className="btn btn-primary rounded-xl">
              লগইন
            </Link>
            <Link to="/" className="btn btn-ghost rounded-xl">
              হোমে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!masjidName.trim()) {
      setError('মসজিদের নাম দিন।');
      return;
    }
    if (!area.trim()) {
      setError('এলাকা / জেলা দিন।');
      return;
    }
    if (!date) {
      setError('তারিখ সিলেক্ট করুন।');
      return;
    }
    if (!item) {
      setError('ইফতার আইটেম সিলেক্ট করুন।');
      return;
    }
    if (item === 'others' && !othersText.trim()) {
      setError('অন্যান্য আইটেমের নাম লিখুন।');
      return;
    }
    if (!areaDetail.trim()) {
      setError('এলাকার বিস্তারিত (গ্রাম/সেক্টর/ব্লক) দিন।');
      return;
    }
    if (!mapLink.trim()) {
      setError('গুগল ম্যাপ লিংক দিন।');
      return;
    }
    if (!phone.trim()) {
      setError('ফোন নম্বর দিন।');
      return;
    }
    setSubmitting(true);
    try {
      const itemKey = item === 'others' ? (othersText.trim().toLowerCase().replace(/\s+/g, '') || 'others') : item;
      const latNum = lat.trim() ? parseFloat(lat.trim()) : undefined;
      const lngNum = lng.trim() ? parseFloat(lng.trim()) : undefined;
      await addSpot({
        masjidName: masjidName.trim(),
        area: area.trim(),
        areaDetail: areaDetail.trim(),
        date,
        item: itemKey,
        items: [itemKey],
        itemDisplay: item === 'others' ? othersText.trim() : undefined,
        mapLink: mapLink.trim(),
        lat: latNum != null && Number.isFinite(latNum) ? latNum : undefined,
        lng: lngNum != null && Number.isFinite(lngNum) ? lngNum : undefined,
        phone: phone.trim(),
        createdBy: user?.uid || user?.email || 'guest',
        createdByEmail: user?.email || undefined,
      });
      await Swal.fire({
        icon: 'success',
        title: 'সফল!',
        text: 'ইফতার স্পট সফলভাবে যোগ হয়েছে।',
        confirmButtonText: 'ঠিক আছে',
        timer: 2000,
        timerProgressBar: true,
      });
      navigate('/', { state: { iftarCreated: true } });
    } catch (err) {
      setError(err.message || 'সাবমিট করা যাচ্ছে না।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200/60 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl" aria-hidden>🌙</span>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              ইফতার স্পট নিবন্ধন
            </h1>
            <p className="text-sm text-base-content/70">
              মসজিদের তথ্য ও ইফতার আইটেম দিন (একটি আইটেম)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="alert alert-error text-sm rounded-xl">
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-base-content flex items-center gap-2">
              🕌 Basic Info
            </h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Masjid Name</span>
              </label>
              <input
                type="text"
                placeholder="মসজিদের নাম"
                className="input input-bordered w-full rounded-xl"
                value={masjidName}
                onChange={(e) => setMasjidName(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Area / District</span>
              </label>
              <input
                type="text"
                placeholder="এলাকা বা জেলা"
                className="input input-bordered w-full rounded-xl"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Area detail (optional)</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: গ্রামের নাম, সেক্টর, ব্লক"
                className="input input-bordered w-full rounded-xl"
                value={areaDetail}
                onChange={(e) => setAreaDetail(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full rounded-xl"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Single Iftar Item */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-base-content flex items-center gap-2">
              🍽 Iftar Item (একটি সিলেক্ট করুন)
            </h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Item</span>
              </label>
              <select
                className="select select-bordered w-full rounded-xl"
                value={item}
                onChange={(e) => {
                  setItem(e.target.value);
                  if (e.target.value !== 'others') setOthersText('');
                }}
                disabled={submitting}
              >
                <option value="">সিলেক্ট করুন</option>
                {IFTAR_ITEMS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {showOthersInput && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Others – Custom item name</span>
                </label>
                <input
                  type="text"
                  placeholder="আইটেমের নাম লিখুন"
                  className="input input-bordered w-full rounded-xl"
                  value={othersText}
                  onChange={(e) => setOthersText(e.target.value)}
                  disabled={submitting}
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-base-content flex items-center gap-2">
              📍 Location
            </h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Google Map link (paste link)</span>
              </label>
              <input
                type="url"
                placeholder="https://www.google.com/maps?q=... অথবা maps.app.goo.gl/..."
                className="input input-bordered w-full rounded-xl"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                disabled={submitting}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  শর্ট লিংক (maps.app.goo.gl) দিলে নিচে ল্যাট/লং দিন, নাহলে ম্যাপে পিন দেখাবে না।
                </span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Latitude (optional – ম্যাপ পিনের জন্য)</span>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="23.7315"
                  className="input input-bordered w-full rounded-xl"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Longitude (optional)</span>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="90.4113"
                  className="input input-bordered w-full rounded-xl"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="bg-base-200/60 rounded-xl p-3 text-sm text-base-content/80 space-y-1">
              <p className="font-medium text-base-content">কিভাবে ল্যাট/লং পাবেন (উদাহরণ):</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>গুগল ম্যাপে আপনার মসজিদের জায়গাটা খুলুন (আপনার ম্যাপ লিংক দিয়ে)।</li>
                <li>ম্যাপে ওই জায়গার ওপর <strong>রাইট-ক্লিক</strong> করুন।</li>
                <li>নিচে একটা পপআপ আসবে – সেখানে ওপরের দিকে <strong>সংখ্যা দুটো</strong> দেখাবে, যেমন <strong>23.7315, 90.4113</strong>।</li>
                <li>ওই সংখ্যায় ক্লিক করলেই কপি হয়ে যাবে। প্রথমটা = Latitude, দ্বিতীয়টা = Longitude।</li>
                <li>Latitude বক্সে প্রথম সংখ্যা (যেমন 23.7315), Longitude বক্সে দ্বিতীয় সংখ্যা (যেমন 90.4113) পেস্ট করুন।</li>
              </ol>
              <p className="text-base-content/60 mt-1">উদাহরণ: বাইতুল মোকাররম = Latitude <code className="bg-base-300 px-1 rounded">23.7315</code>, Longitude <code className="bg-base-300 px-1 rounded">90.4113</code></p>
            </div>
          </div>

          {/* Phone */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">📞 Phone (optional)</span>
            </label>
            <input
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              className="input input-bordered w-full rounded-xl"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="btn btn-primary rounded-xl"
              disabled={submitting}
            >
              {submitting ? 'জমা হচ্ছে...' : 'সাবমিট'}
            </button>
            <Link to="/" className="btn btn-ghost rounded-xl">
              বাতিল
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIftarSpot;
