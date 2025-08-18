import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal';
import userReducer from './user';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 