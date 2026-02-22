/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { IFTAR_ITEMS } from '../data/iftarItems';

const EditSpotModal = ({ spot, onClose, onSave }) => {
  const [masjidName, setMasjidName] = useState('');
  const [area, setArea] = useState('');
  const [areaDetail, setAreaDetail] = useState('');
  const [date, setDate] = useState('');
  const [item, setItem] = useState('');
  const [othersText, setOthersText] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!spot) return;
    setMasjidName(spot.masjidName || '');
    setArea(spot.area || '');
    setAreaDetail(spot.areaDetail || '');
    setDate(spot.date || '');
    const firstItem = spot.items?.[0] || spot.item || '';
    setItem(firstItem);
    setOthersText(spot.itemDisplay && !IFTAR_ITEMS.find((i) => i.key === firstItem) ? spot.itemDisplay : '');
    setMapLink(spot.mapLink || '');
    setPhone(spot.phone || '');
  }, [spot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!masjidName.trim()) {
      setError('মসজিদের নাম দিন।');
      return;
    }
    if (!area.trim()) {
      setError('এলাকা দিন।');
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
    const itemKey = item === 'others' ? (othersText.trim().toLowerCase().replace(/\s+/g, '') || 'others') : item;
    onSave(spot._id || spot.id, {
      masjidName: masjidName.trim(),
      area: area.trim(),
      areaDetail: areaDetail.trim() || undefined,
      date,
      item: itemKey,
      items: [itemKey],
      itemDisplay: item === 'others' ? othersText.trim() : undefined,
      mapLink: mapLink.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    onClose();
  };

  if (!spot) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg">✏️ ইফতার স্পট এডিট করুন</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && <div className="alert alert-error text-sm">{error}</div>}
          <div>
            <label className="label"><span className="label-text">Masjid Name</span></label>
            <input type="text" className="input input-bordered w-full" value={masjidName} onChange={(e) => setMasjidName(e.target.value)} />
          </div>
          <div>
            <label className="label"><span className="label-text">Area</span></label>
            <input type="text" className="input input-bordered w-full" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
          <div>
            <label className="label"><span className="label-text">Area detail (village/block)</span></label>
            <input type="text" className="input input-bordered w-full" placeholder="যেমন: Dhanmondi Sector 4" value={areaDetail} onChange={(e) => setAreaDetail(e.target.value)} />
          </div>
          <div>
            <label className="label"><span className="label-text">Date</span></label>
            <input type="date" className="input input-bordered w-full" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label"><span className="label-text">Item</span></label>
            <select className="select select-bordered w-full" value={item} onChange={(e) => { setItem(e.target.value); if (e.target.value !== 'others') setOthersText(''); }}>
              {IFTAR_ITEMS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            {item === 'others' && (
              <input type="text" className="input input-bordered w-full mt-2" placeholder="আইটেমের নাম" value={othersText} onChange={(e) => setOthersText(e.target.value)} />
            )}
          </div>
          <div>
            <label className="label"><span className="label-text">Google Map link</span></label>
            <input type="url" className="input input-bordered w-full" value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
          </div>
          <div>
            <label className="label"><span className="label-text">Phone</span></label>
            <input type="tel" className="input input-bordered w-full" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>বাতিল</button>
            <button type="submit" className="btn btn-primary">সেভ করুন</button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button type="button">close</button>
      </form>
    </dialog>
  );
};

export default EditSpotModal;
