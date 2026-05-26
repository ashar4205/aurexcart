import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;

// ─── Currency conversion rates (relative to USD) ──────────────────────────
export const CURRENCY_RATES = {
  USD: 1,
  PKR: 278,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
  INR: 83,
  BDT: 110,
  CAD: 1.36,
  AUD: 1.53,
};

export const CURRENCY_SYMBOLS = {
  USD: '$', PKR: '₨', EUR: '€', GBP: '£', AED: 'د.إ',
  SAR: '﷼', INR: '₹', BDT: '৳', CAD: 'CA$', AUD: 'A$',
};

export const formatPrice = (price, currency = 'USD') => {
  const rate = CURRENCY_RATES[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const converted = price * rate;
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};
