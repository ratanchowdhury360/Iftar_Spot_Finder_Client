import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import * as commentApi from '../api/commentApi';

const SpotComments = ({ spotId, currentUserId, isAdmin }) => {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const loadComments = useCallback(async () => {
    if (!spotId) return;
    setLoading(true);
    setError('');
    try {
      const data = await commentApi.getCommentsBySpotId(spotId);
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setError('কমেন্ট লোড করা যাচ্ছে না।');
    } finally {
      setLoading(false);
    }
  }, [spotId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const toggleExpand = () => {
    setExpanded((e) => !e);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUserId || !newComment.trim()) return;
    setSubmitLoading(true);
    setError('');
    try {
      const created = await commentApi.createComment({
        spotId,
        email: currentUserId,
        comment: newComment.trim(),
        createdAt: new Date().toISOString(),
      });
      if (created && typeof created === 'object') {
        setComments((prev) => [...prev, created]);
      } else {
        loadComments();
      }
      setNewComment('');
      await Swal.fire({
        icon: 'success',
        title: 'সফল!',
        text: 'কমেন্ট যোগ হয়েছে।',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: 'ঠিক আছে',
      });
    } catch {
      setError('কমেন্ট সেভ করা যাচ্ছে না।');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStartEdit = (c) => {
    setEditingId(c._id || c.id);
    setEditText(c.comment || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = async () => {
    if (editingId == null || !editText.trim()) return;
    try {
      const updated = await commentApi.updateComment(editingId, {
        comment: editText.trim(),
      });
      setComments((prev) =>
        prev.map((c) => ((c._id || c.id) === (updated._id || updated.id) ? updated : c)),
      );
      setEditingId(null);
      setEditText('');
      await Swal.fire({
        icon: 'success',
        title: 'সফল!',
        text: 'কমেন্ট আপডেট হয়েছে।',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: 'ঠিক আছে',
      });
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'দুঃখিত!',
        text: 'আপডেট করা যায়নি।',
        confirmButtonText: 'ঠিক আছে',
      });
    }
  };

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'নিশ্চিত কি?',
        text: 'কমেন্ট ডিলিট করলে মুছে যাবে।',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#dc2626',
      });
      if (!result.isConfirmed) return;
      try {
        await commentApi.deleteComment(id);
        setComments((prev) => prev.filter((c) => (c._id || c.id) !== id));
        await Swal.fire({
          icon: 'success',
          title: 'সফল!',
          text: 'কমেন্ট ডিলিট হয়েছে।',
          timer: 2000,
          timerProgressBar: true,
          confirmButtonText: 'ঠিক আছে',
        });
      } catch {
        await Swal.fire({
          icon: 'error',
          title: 'দুঃখিত!',
          text: 'ডিলিট করা যায়নি।',
          confirmButtonText: 'ঠিক আছে',
        });
      }
    },
    [],
  );

  const count = comments.length;
  const countReady = !loading;
  const canModify = (c) =>
    currentUserId && (c.email === currentUserId || isAdmin);

  return (
    <div className="border-t border-base-200/70 mt-2 pt-3">
      <button
        type="button"
        onClick={toggleExpand}
        className="btn btn-ghost btn-sm gap-1.5 w-full justify-start text-base-content/80 hover:text-base-content rounded-xl"
      >
        <span>💬</span>
        {countReady ? (
          <span>Comments ({count})</span>
        ) : (
          <span className="flex items-center gap-1.5">
            Comments
            <span className="loading loading-spinner loading-xs" />
          </span>
        )}
        <span className="ml-auto opacity-70">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {error && (
            <div className="alert alert-error text-xs rounded-xl py-2">
              <span>{error}</span>
            </div>
          )}

          {currentUserId && (
            <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="কমেন্ট লিখুন..."
                className="input input-bordered input-sm flex-1 rounded-xl text-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm rounded-xl shrink-0"
                disabled={submitLoading || !newComment.trim()}
              >
                {submitLoading ? '...' : 'পোস্ট'}
              </button>
            </form>
          )}

          {!currentUserId && (
            <p className="text-xs text-base-content/60">
              কমেন্ট করতে লগইন করুন।
            </p>
          )}

          {loading ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner loading-sm text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-base-content/50 py-2">কোনো কমেন্ট নেই।</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {comments.map((c) => {
                const id = c._id || c.id;
                const isEditing = editingId === id;
                const dateStr =
                  c.createdAt &&
                  new Date(c.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                return (
                  <li
                    key={id}
                    className="bg-base-200/50 rounded-xl p-2 sm:p-3 text-sm"
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full rounded-lg text-sm"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn btn-xs btn-primary rounded-lg"
                            onClick={handleSaveEdit}
                          >
                            সেভ
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs btn-ghost rounded-lg"
                            onClick={handleCancelEdit}
                          >
                            বাতিল
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                          <span className="font-medium text-base-content/90 text-xs truncate max-w-[70%]">
                            {c.email}
                          </span>
                          <span className="text-xs text-base-content/50">
                            {dateStr}
                          </span>
                        </div>
                        <p className="text-base-content/80 whitespace-pre-wrap break-words text-xs sm:text-sm">
                          {c.comment}
                        </p>
                        {canModify(c) && (
                          <div className="flex gap-1 mt-2">
                            {c.email === currentUserId && (
                              <button
                                type="button"
                                className="btn btn-xs btn-ghost rounded-lg text-primary"
                                onClick={() => handleStartEdit(c)}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-xs btn-ghost text-error rounded-lg"
                              onClick={() => handleDelete(id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(SpotComments);
