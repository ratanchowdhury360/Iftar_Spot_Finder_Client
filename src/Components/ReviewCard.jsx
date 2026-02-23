import React, { useMemo } from 'react';

const STARS = '⭐';
const RATING_MIN = 1;
const RATING_MAX = 5;

const getRating = (review) =>
  Math.max(RATING_MIN, Math.min(RATING_MAX, Number(review?.rating) || 0));

const getDateStr = (createdAt) =>
  createdAt
    ? new Date(createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

/**
 * Shared review card: responsive (sm/md/lg), purple-400 tint bg.
 * @param {Object} review - { _id/id, email, comment, rating, createdAt }
 * @param {'compact'|'full'} variant - compact: 3-line clamp, no actions; full: full text, Edit/Delete
 * @param {boolean} showAdminDelete - show Delete button (admin on home)
 * @param {function} onAdminDelete - (id) => Promise, called when admin deletes
 * @param {function} onEdit - (review) => void, only for full variant
 * @param {function} onDelete - (id) => void, only for full variant
 */
const ReviewCard = ({
  review,
  variant = 'compact',
  showAdminDelete = false,
  onAdminDelete,
  onEdit,
  onDelete,
}) => {
  const id = review?._id || review?.id;
  const rating = useMemo(() => getRating(review), [review?.rating]);
  const stars = useMemo(() => STARS.repeat(rating), [rating]);
  const dateStr = useMemo(() => getDateStr(review?.createdAt), [review?.createdAt]);
  const isCompact = variant === 'compact';

  const cardBg =
    'bg-gradient-to-br from-purple-400/15 via-blue-400/10 to-purple-400/15 border border-purple-400/20';

  return (
    <article
      className={`card shadow-sm rounded-2xl overflow-hidden ${cardBg} transition-shadow hover:shadow-md`}
    >
      <div className="card-body p-4 sm:p-5 md:p-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm sm:text-sm md:text-base font-medium text-base-content truncate min-w-0">
            {review?.email}
          </span>
          <span className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 shrink-0" aria-label="Rating">
            {stars} {isCompact && `(${rating})`}
          </span>
        </div>
        <p
          className={`text-sm text-base-content/80 ${
            isCompact ? 'line-clamp-3' : 'whitespace-pre-line'
          }`}
        >
          {review?.comment}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-base-content/60">
          <span>{dateStr}</span>
          <div className="flex gap-2 shrink-0">
            {isCompact && showAdminDelete && onAdminDelete && (
              <button
                type="button"
                className="btn btn-xs btn-ghost text-error"
                onClick={() => onAdminDelete(id)}
              >
                Delete
              </button>
            )}
            {!isCompact && (
              <>
                {onEdit && (
                  <button
                    type="button"
                    className="btn btn-xs btn-outline rounded-xl"
                    onClick={() => onEdit(review)}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost text-error"
                    onClick={() => onDelete(id)}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default React.memo(ReviewCard);
