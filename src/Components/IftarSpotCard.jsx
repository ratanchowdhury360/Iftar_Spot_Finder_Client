/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { IFTAR_ITEMS, getItemImageSrc, getItemLabel } from '../data/iftarItems';
import SpotComments from './SpotComments';

const getSpotItem = (spot) =>
  spot?.item ?? spot?.items?.[0];

const getSpotItemLabel = (spot, getItemLabelFn) => {
  const item = getSpotItem(spot);
  if (spot?.itemDisplay) return spot.itemDisplay;
  return item ? getItemLabelFn(item) : 'Iftar';
};

const IftarSpotCard = ({
  spot,
  currentUserId,
  isAdmin = false,
  isExpired = false,
  onLike,
  onEdit,
  onDelete,
  showViewDetails = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const item = getSpotItem(spot);
  const itemLabel = getSpotItemLabel(spot, getItemLabel);
  const imgSrc = getItemImageSrc(item);

  const fallbackImage = '/Items/misro.png';
  const imageUrl = (imgSrc && !imgError) ? imgSrc : fallbackImage;

  const likeCount = Array.isArray(spot?.likes) ? spot.likes.length : 0;
  const isLiked = Boolean(currentUserId && spot?.likes?.includes(currentUserId));
  const isCreator = Boolean(
    currentUserId &&
      (spot?.createdBy === currentUserId || spot?.createdByEmail === currentUserId)
  );
  const canDelete = !isExpired && (isCreator || isAdmin);
  const canEdit = isCreator;

  const handleMapClick = () => {
    if (spot?.mapLink) window.open(spot.mapLink, '_blank', 'noopener,noreferrer');
  };

  const handleLike = () => {
    if (currentUserId) onLike?.(spot?._id || spot?.id);
  };

  return (
    <article className="card bg-base-100 w-full max-w-md mx-auto shadow-lg rounded-2xl overflow-hidden border border-base-200/60 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
      <figure className="relative h-44 sm:h-52 md:h-56 overflow-hidden bg-base-200">
        <img
          src={imageUrl}
          alt={itemLabel}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <span className="badge badge-md bg-primary/90 text-primary-content border-0">
            {itemLabel}
          </span>
        </div>
      </figure>

      <div className="card-body p-4 sm:p-5 gap-2">
        <h2 className="card-title text-lg sm:text-xl text-base-content font-semibold leading-tight">
          🕌 {spot?.masjidName}
        </h2>
        <p className="flex items-center gap-1.5 text-sm text-base-content/80">
          <span>📅</span>
          {spot?.date
            ? new Date(spot.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '—'}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-base-content/80">
          <span>📍</span>
          {spot?.areaDetail ? `${spot.area}, ${spot.areaDetail}` : (spot?.area || '—')}
        </p>
        {spot?.phone && (
          <p className="flex items-center gap-1.5 text-sm">
            <span>📞</span>
            <a href={`tel:${spot.phone}`} className="link link-primary">
              {spot.phone}
            </a>
          </p>
        )}
        {(spot?.createdByEmail || spot?.email) && (
          <p className="flex items-center gap-1.5 text-sm text-base-content/80">
            <span>📧</span>
            <a href={`mailto:${spot.createdByEmail || spot.email}`} className="link link-primary truncate">
              {spot.createdByEmail || spot.email}
            </a>
          </p>
        )}
      </div>

      <div className="card-actions p-4 sm:p-5 pt-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={handleLike}
          disabled={!currentUserId}
          title={!currentUserId ? 'লাইক দিতে লগইন করুন' : ''}
          className={`btn btn-sm gap-1.5 flex-1 sm:flex-none ${!currentUserId ? 'btn-ghost' : isLiked ? 'btn-primary' : 'btn-outline btn-primary'}`}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <span>👍</span>
          <span>Like</span>
          {likeCount > 0 && (
            <span className="badge badge-sm bg-base-100 text-primary border border-primary">
              {likeCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={handleMapClick}
          className="btn btn-sm btn-outline gap-1.5 flex-1 sm:flex-none"
        >
          🗺 Map
        </button>
        {canEdit && onEdit && (
          <button
            type="button"
            onClick={() => onEdit(spot)}
            className="btn btn-sm btn-outline gap-1"
          >
            ✏️ Edit
          </button>
        )}
        {canDelete && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(spot?._id || spot?.id)}
            className="btn btn-sm btn-error btn-outline gap-1"
          >
            🗑 Delete
          </button>
        )}
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <SpotComments
          spotId={spot?._id || spot?.id}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      </div>
    </article>
  );
};

export default IftarSpotCard;
export { IFTAR_ITEMS, getItemLabel };
