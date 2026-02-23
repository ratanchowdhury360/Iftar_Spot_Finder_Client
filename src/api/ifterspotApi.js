import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const IFTAR_SPOT_URL = `${BASE_URL}/ifterspot`;

export const getSpots = async () => {
  const { data } = await axios.get(IFTAR_SPOT_URL);
  return Array.isArray(data) ? data : [];
};

export const createSpot = async (spot) => {
  const payload = {
    masjidName: spot.masjidName,
    area: spot.area,
    areaDetail: spot.areaDetail || undefined,
    date: spot.date,
    items: Array.isArray(spot.items) && spot.items.length ? spot.items : (spot.item ? [spot.item] : []),
    phone: spot.phone || undefined,
    mapLink: spot.mapLink || undefined,
    lat: spot.lat != null && Number.isFinite(spot.lat) ? spot.lat : undefined,
    lng: spot.lng != null && Number.isFinite(spot.lng) ? spot.lng : undefined,
    createdBy: spot.createdBy,
    createdByEmail: spot.createdByEmail,
    roleAtCreation: 'user',
    likes: spot.likes || [],
    status: 'approved',
  };
  const { data } = await axios.post(IFTAR_SPOT_URL, payload);
  return data;
};

export const updateSpot = async (id, payload) => {
  const { data } = await axios.patch(`${IFTAR_SPOT_URL}/${id}`, payload);
  return data;
};

export const deleteSpot = async (id) => {
  await axios.delete(`${IFTAR_SPOT_URL}/${id}`);
};

export const toggleLikeSpot = async (id, userEmail) => {
  if (!userEmail) return null;
  const spots = await getSpots();
  const spot = spots.find((s) => (s._id || s.id) === id);
  if (!spot) return null;
  const likes = Array.isArray(spot.likes) ? [...spot.likes] : [];
  const i = likes.indexOf(userEmail);
  if (i >= 0) likes.splice(i, 1);
  else likes.push(userEmail);
  const { data } = await axios.put(`${IFTAR_SPOT_URL}/${id}`, { ...spot, likes });
  return data;
};
