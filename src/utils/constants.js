// Admin check: এই ইমেইল যিনি লগইন করবেন তাকে Admin হিসেবে ধরা হবে
export const ADMIN_EMAIL = 'admin@ifter.com';

export const isAdmin = (user) => Boolean(user?.email === ADMIN_EMAIL);
