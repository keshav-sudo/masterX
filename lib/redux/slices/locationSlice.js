import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  // Server-side: Always default to 'Bhopal' (no localStorage access)
  return { city: 'Bhopal', area: '', lat: null, lng: null };
};

const locationSlice = createSlice({
  name: 'location',
  initialState: getInitialState(),
  reducers: {
    setLocation: (state, action) => {
      const { city, area, lat, lng } = action.payload;
      if (city) { state.city = city; if (typeof window !== 'undefined') localStorage.setItem('mx_city', city); }
      if (area !== undefined) { state.area = area; if (typeof window !== 'undefined') localStorage.setItem('mx_area', area); }
      if (lat) state.lat = lat;
      if (lng) state.lng = lng;
    },
    setCity: (state, action) => {
      state.city = action.payload;
      if (typeof window !== 'undefined') localStorage.setItem('mx_city', action.payload);
    },
    setArea: (state, action) => {
      state.area = action.payload;
      if (typeof window !== 'undefined') localStorage.setItem('mx_area', action.payload);
    },
  },
});

export const { setLocation, setCity, setArea } = locationSlice.actions;

// Selectors
export const selectCity = (state) => state.location.city;
export const selectArea = (state) => state.location.area;
export const selectLocation = (state) => state.location;

export default locationSlice.reducer;
