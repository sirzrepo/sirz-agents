import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal';
import userReducer from './user';
import haveStoreReducer from './haveStore';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    haveStore: haveStoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 