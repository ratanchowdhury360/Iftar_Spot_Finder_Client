import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../Context/AuthProvider';
import { useIftarSpots } from '../Context/IftarSpotsContext';
import { IFTAR_ITEMS } from '../data/iftarItems';

const CreateIftarSpot = () => {
  const { user } = useContext(AuthContext);
  const { addSpot } = useIftarSpots();
  const navigate = useNavigate();

  const [masjidName, setMasjidName] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [item, setItem] = useState('');
  const [othersText, setOthersText] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showOthersInput = item === 'others';

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
    setSubmitting(true);
    try {
      const itemKey = item === 'others' ? (othersText.trim().toLowerCase().replace(/\s+/g, '') || 'others') : item;
      addSpot({
        masjidName: masjidName.trim(),
        area: area.trim(),
        date,
        item: itemKey,
        items: [itemKey],
        itemDisplay: item === 'others' ? othersText.trim() : undefined,
        mapLink: mapLink.trim() || undefined,
        phone: phone.trim() || undefined,
        createdBy: user?.uid || user?.email || 'guest',
        status: 'pending',
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
                placeholder="https://www.google.com/maps?q=..."
                className="input input-bordered w-full rounded-xl"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                disabled={submitting}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Option 1: গুগল ম্যাপ থেকে শেয়ার লিংক পেস্ট করুন
                </span>
              </label>
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
