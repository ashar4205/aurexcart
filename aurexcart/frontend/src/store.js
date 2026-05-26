import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './lib/api';

// ─── Auth Store ────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete api.defaults.headers.common['Authorization'];
      },

      updateUser: (updates) => set(state => ({ user: { ...state.user, ...updates } })),

      restoreToken: () => {
        const { token } = get();
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
    }),
    { name: 'aurexcart-auth', partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);

// ─── Cart Store ────────────────────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set(state => {
          const existing = state.items.find(i => i._id === product._id);
          if (existing) {
            return { items: state.items.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i) };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
      },

      removeItem: (productId) => set(state => ({ items: state.items.filter(i => i._id !== productId) })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeItem(productId); return; }
        set(state => ({ items: state.items.map(i => i._id === productId ? { ...i, quantity } : i) }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      get totalItems() { return get().items.reduce((s, i) => s + i.quantity, 0); },
      get totalPrice() { return get().items.reduce((s, i) => s + i.price * i.quantity, 0); },
    }),
    { name: 'aurexcart-cart' }
  )
);

// ─── UI Store ──────────────────────────────────────────────────────────────
export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      currency: 'USD',
      navOpen: false,
      loadingDone: false,

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.className = `theme-${theme}`;
      },
      setCurrency: (currency) => set({ currency }),
      toggleNav: () => set(state => ({ navOpen: !state.navOpen })),
      closeNav: () => set({ navOpen: false }),
      setLoadingDone: () => set({ loadingDone: true }),
    }),
    { name: 'aurexcart-ui', partialize: (s) => ({ theme: s.theme, currency: s.currency }) }
  )
);
