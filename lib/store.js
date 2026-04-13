import { create } from 'zustand';

export const useLocationStore = create((set) => {
  let savedCity = null;
  let savedArea = null;
  if (typeof window !== 'undefined') {
    savedCity = localStorage.getItem('px_city') || 'Bhopal';
    savedArea = localStorage.getItem('px_area') || '';
  }
  return {
    city: savedCity || 'Bhopal',
    area: savedArea || '',
    lat: null,
    lng: null,
    setLocation: (data) => {
      if (typeof window !== 'undefined') {
        if (data.city) localStorage.setItem('px_city', data.city);
        if (data.area) localStorage.setItem('px_area', data.area);
      }
      set(data);
    },
  };
});

export const useNotificationStore = create((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  decrement: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
}));

export const useLangStore = create((set) => {
  let savedLang = 'en';
  if (typeof window !== 'undefined') {
    savedLang = localStorage.getItem('px_lang') || 'en';
  }
  return {
    lang: savedLang,
    setLang: (lang) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('px_lang', lang);
      }
      set({ lang });
    },
  };
});
