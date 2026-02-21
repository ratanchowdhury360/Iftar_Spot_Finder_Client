import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../Context/AuthProvider';

const SignUp = () => {
  const { createUser, googleSignIn, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password || !confirmPassword) {
      setError('সব ফিল্ড পূরণ করুন।');
      return;
    }
    if (password.length < 6) {
      setError('পাসওয়ার্ড অন্তত ৬ অক্ষর দিন।');
      return;
    }
    if (password !== confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না।');
      return;
    }
    setSubmitLoading(true);
    try {
      await createUser(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'এই ইমেইল দিয়ে আগেই রেজিস্ট্রেশন হয়েছে।'
          : err.code === 'auth/weak-password'
            ? 'পাসওয়ার্ড শক্তিশালী করুন (অন্তত ৬ অক্ষর)।'
            : err.message || 'রেজিস্ট্রেশন করা যাচ্ছে না।';
      setError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSubmitLoading(true);
    try {
      await googleSignIn();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Google দিয়ে রেজিস্ট্রেশন করা যাচ্ছে না।');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200/60 p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="text-4xl" aria-hidden>🌙</span>
            <h1 className="text-2xl font-bold text-base-content mt-2">
              রেজিস্টার
            </h1>
            <p className="text-base-content/70 text-sm mt-1">
              Iftar Spot যোগ করতে অ্যাকাউন্ট তৈরি করুন
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error text-sm rounded-xl">
                <span>{error}</span>
              </div>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || submitLoading}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="অন্তত ৬ অক্ষর"
                className="input input-bordered w-full rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || submitLoading}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="পাসওয়ার্ড আবার লিখুন"
                className="input input-bordered w-full rounded-xl"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || submitLoading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl"
              disabled={loading || submitLoading}
            >
              {submitLoading ? 'রেজিস্ট্রেশন হচ্ছে...' : 'রেজিস্টার'}
            </button>
          </form>

          <div className="divider text-base-content/60 text-sm">অথবা</div>

          <button
            type="button"
            onClick={handleGoogle}
            className="btn btn-outline w-full rounded-xl gap-2"
            disabled={loading || submitLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google দিয়ে রেজিস্টার
          </button>

          <p className="text-center text-sm text-base-content/70 mt-6">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link to="/login" className="link link-primary font-medium">
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
