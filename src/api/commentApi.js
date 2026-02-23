import axios from 'axios';

const BASE_URL = 'https://iftar-spot-finder-server.onrender.com';
const COMMENT_URL = `${BASE_URL}/comment`;

export const getCommentsBySpotId = async (spotId) => {
  if (!spotId) return [];
  const { data } = await axios.get(`${COMMENT_URL}/spot/${encodeURIComponent(spotId)}`);
  return Array.isArray(data) ? data : [];
};

export const createComment = async (payload) => {
  const { data } = await axios.post(COMMENT_URL, payload);
  return data;
};

export const updateComment = async (id, payload) => {
  const { data } = await axios.patch(`${COMMENT_URL}/${id}`, payload);
  return data;
};

export const deleteComment = async (id) => {
  await axios.delete(`${COMMENT_URL}/${id}`);
};
