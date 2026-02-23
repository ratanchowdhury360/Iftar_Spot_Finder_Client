import axios from 'axios';

const BASE_URL = 'https://iftar-spot-finder-server.onrender.com';
const REVIEW_URL = `${BASE_URL}/review`;

export const getAllReviews = async () => {
  const { data } = await axios.get(REVIEW_URL);
  return Array.isArray(data) ? data : [];
};

export const getUserReviews = async (email) => {
  if (!email) return [];
  const { data } = await axios.get(`${REVIEW_URL}/user/${encodeURIComponent(email)}`);
  return Array.isArray(data) ? data : [];
};

export const createReview = async (payload) => {
  const { data } = await axios.post(REVIEW_URL, payload);
  return data;
};

export const updateReview = async (id, payload) => {
  const { data } = await axios.patch(`${REVIEW_URL}/${id}`, payload);
  return data;
};

export const deleteReview = async (id) => {
  await axios.delete(`${REVIEW_URL}/${id}`);
};

