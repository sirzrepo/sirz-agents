import { createSlice } from '@reduxjs/toolkit';

interface BrandState {
  isBrandRegistered: boolean;
}

const initialState: BrandState = {
    isBrandRegistered: false,
};

export const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    brandRegistered: (state) => {
      state.isBrandRegistered = true;
    },
    brandUnregistered: (state) => {
      state.isBrandRegistered = false;
    },
    },
});

export const { brandRegistered, brandUnregistered } = brandSlice.actions;
export default brandSlice.reducer; 