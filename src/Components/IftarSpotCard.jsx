import React, { useState } from 'react';
import { IFTAR_ITEMS, getItemImageSrc, getItemLabel } from '../data/iftarItems';

// Spot has one item: spot.item (string) or spot.items?.[0]
const getSpotItem = (spot) =>
  spot?.item ?? spot?.items?.[0];

const getSpotItemLabel = (spot, getItemLabel) => {
  const item = getSpotItem(spot);
  if (spot?.itemDisplay) return spot.itemDisplay;
  return item ? getItemLabel(item) : 'Iftar';
};

const IftarSpotCard = ({
  spot,
  onLike,
  isLiked = false,
  likeCount = 0,
  showViewDetails = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const item = getSpotItem(spot);
  const itemLabel = getSpotItemLabel(spot, getItemLabel);
  const imgSrc = getItemImageSrc(item);

  const fallbackImage = '/Items/misro.png';
  const imageUrl = (imgSrc && !imgError) ? imgSrc : fallbackImage;

  const handleMapClick = () => {
    if (spot?.mapLink) window.open(spot.mapLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="card bg-base-100 w-full max-w-md mx-auto shadow-lg rounded-2xl overflow-hidden border border-base-200/60 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
      {/* Top: Single item image */}
      <figure className="relative h-44 sm:h-52 md:h-56 overflow-hidden bg-base-200">
        <img
          src={imageUrl}
          alt={itemLabel}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <span className="badge badge-md bg-primary/90 text-primary-content border-0">
            {itemLabel}
          </span>
        </div>
      </figure>

      {/* Middle: Masjid info */}
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
          {spot?.area || '—'}
        </p>
        {spot?.phone && (
          <p className="flex items-center gap-1.5 text-sm">
            <span>📞</span>
            <a href={`tel:${spot.phone}`} className="link link-primary">
              {spot.phone}
            </a>
          </p>
        )}
      </div>

      {/* Bottom: Like + Map + View Details */}
      <div className="card-actions p-4 sm:p-5 pt-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onLike?.(spot?.id)}
          className={`btn btn-sm gap-1.5 flex-1 sm:flex-none ${isLiked ? 'btn-primary' : 'btn-outline btn-primary'}`}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <span className="text-base">{isLiked ? '👍' : '👍'}</span>
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
        {showViewDetails && (
          <button type="button" className="btn btn-sm btn-ghost gap-1">
            👁 View Details
          </button>
        )}
      </div>
    </article>
  );
};

export default IftarSpotCard;
export { IFTAR_ITEMS, getItemLabel };
