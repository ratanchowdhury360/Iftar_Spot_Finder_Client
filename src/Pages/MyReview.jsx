import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../Context/AuthProvider';
import * as reviewApi from '../api/reviewApi';
import ReviewCard from '../Components/ReviewCard';

const MyReview = () => {
  const { user, loading } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [editingReview, setEditingReview] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');

  const userEmail = user?.email || '';

  useEffect(() => {
    const load = async () => {
      if (!userEmail) {
        setReviews([]);
        setListLoading(false);
        return;
      }
      try {
        setListLoading(true);
        setListError('');
        const data = await reviewApi.getUserReviews(userEmail);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setListError('রিভিউ লোড করা যাচ্ছে না। পরে আবার চেষ্টা করুন।');
      } finally {
        setListLoading(false);
      }
    };
    load();
  }, [userEmail]);

  const isEditing = Boolean(editingReview);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return;
    setFormError('');
    const trimmed = comment.trim();
    if (!trimmed) {
      setFormError('রিভিউ লিখুন।');
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      setFormError('১ থেকে ৫-এর মধ্যে স্টার নির্বাচন করুন।');
      return;
    }

    const payload = {
      email: userEmail,
      comment: trimmed,
      rating,
      createdAt: editingReview?.createdAt || new Date().toISOString(),
    };

    try {
      setSubmitLoading(true);
      if (isEditing) {
        const id = editingReview._id || editingReview.id;
        const updated = await reviewApi.updateReview(id, payload);
        setReviews((prev) =>
          prev.map((r) => ((r._id || r.id) === (updated._id || updated.id) ? updated : r)),
        );
        setEditingReview(null);
        await Swal.fire({
          icon: 'success',
          title: 'সফল!',
          text: 'রিভিউ আপডেট হয়েছে।',
          timer: 2000,
          timerProgressBar: true,
          confirmButtonText: 'ঠিক আছে',
        });
      } else {
        const created = await reviewApi.createReview(payload);
        setReviews((prev) => [created, ...prev]);
        await Swal.fire({
          icon: 'success',
          title: 'সফল!',
          text: 'রিভিউ সাবমিট হয়েছে।',
          timer: 2000,
          timerProgressBar: true,
          confirmButtonText: 'ঠিক আছে',
        });
      }
      setComment('');
      setRating(5);
    } catch (err) {
      setFormError('রিভিউ সেভ করা যাচ্ছে না। পরে আবার চেষ্টা করুন।');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setComment(review.comment || '');
    setRating(review.rating || 5);
  };

  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'নিশ্চিত কি?',
      text: 'রিভিউ ডিলিট করলে এটি চিরতরে মুছে যাবে।',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
      cancelButtonText: 'বাতিল',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed) return;
    try {
      await reviewApi.deleteReview(id);
      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
      await Swal.fire({
        icon: 'success',
        title: 'সফল!',
        text: 'রিভিউ ডিলিট হয়েছে।',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: 'ঠিক আছে',
      });
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'দুঃখিত!',
        text: 'রিভিউ ডিলিট করা যায়নি। পরে আবার চেষ্টা করুন।',
        confirmButtonText: 'ঠিক আছে',
      });
    }
  }, []);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) =>
          new Date(b.createdAt || b._id?.toString?.() || 0) -
          new Date(a.createdAt || a._id?.toString?.() || 0),
      ),
    [reviews],
  );

  if (!loading && !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">রিভিউ দিতে লগইন করুন</h1>
          <p className="text-base-content/70">
            আপনার অভিজ্ঞতা শেয়ার করতে আগে লগইন করুন। ইফতার স্পট সম্পর্কে আপনার মতামত অন্যদের
            সাহায্য করবে।
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/login" className="btn btn-primary rounded-xl">
              লগইন
            </Link>
            <Link to="/signup" className="btn btn-outline rounded-xl">
              রেজিস্টার
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-base-200/50 to-base-100">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content mb-2">My Review</h1>
        <p className="text-base-content/70 mb-6 sm:mb-8 text-sm sm:text-base">
          Iftar Spot Finder সম্পর্কে আপনার অভিজ্ঞতা জানান। আপনি চাইলে যেকোনো সময় রিভিউ আপডেট বা
          ডিলিট করতে পারবেন।
        </p>

        <div className="bg-base-100 rounded-2xl shadow border border-base-200/70 p-4 sm:p-6 md:p-7 mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            {isEditing ? 'রিভিউ আপডেট করুন' : 'একটি নতুন রিভিউ লিখুন'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="alert alert-error text-sm rounded-xl">
                <span>{formError}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-40">
                <label className="label pb-1">
                  <span className="label-text text-sm">স্টার রেটিং</span>
                </label>
                <select
                  className="select select-bordered w-full rounded-xl"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {'⭐'.repeat(value)} ({value})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="label pb-1">
                  <span className="label-text text-sm">আপনার মতামত</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full rounded-2xl min-h-[90px]"
                  placeholder="কিছু লিখুন... যেমন: সাইটটি কেমন লাগলো, কোন ফিচারটি বেশি কাজে লেগেছে ইত্যাদি।"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setEditingReview(null);
                    setComment('');
                    setRating(5);
                    setFormError('');
                  }}
                >
                  বাতিল করুন
                </button>
              )}
              <div className="flex-1" />
              <button
                type="submit"
                className="btn btn-primary rounded-xl"
                disabled={submitLoading}
              >
                {submitLoading ? 'সেভ হচ্ছে...' : isEditing ? 'রিভিউ আপডেট করুন' : 'রিভিউ সাবমিট করুন'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold">আমার রিভিউসমূহ</h2>
            <span className="text-sm text-base-content/60">
              মোট {sortedReviews.length} টি রিভিউ
            </span>
          </div>

          {listError && (
            <div className="alert alert-error text-sm rounded-xl mb-4">
              <span>{listError}</span>
            </div>
          )}

          {listLoading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="text-center py-8 sm:py-10 bg-base-200/50 rounded-2xl px-4">
              <p className="text-base-content/70 text-sm sm:text-base">
                আপনি এখনও কোনো রিভিউ দেননি। উপরের ফর্ম থেকে প্রথম রিভিউ দিন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {sortedReviews.map((review) => (
                <ReviewCard
                  key={review._id || review.id}
                  review={review}
                  variant="full"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReview;

