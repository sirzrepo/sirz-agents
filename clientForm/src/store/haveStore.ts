import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HaveStoreState {
  isHaveStore: boolean;
}

const initialState: HaveStoreState = {
    isHaveStore: false,
};

export const haveStoreSlice = createSlice({
  name: 'haveStore',
  initialState,
  reducers: {
    haveStore: (state, action: PayloadAction<boolean>) => {
      state.isHaveStore = action.payload;
    },
    // Removed unused closeModal action
    setHaveStore: (state, action: PayloadAction<boolean>) => {
  state.isHaveStore = action.payload;
},
    },
});

export const { haveStore, setHaveStore } = haveStoreSlice.actions;
export default haveStoreSlice.reducer; 