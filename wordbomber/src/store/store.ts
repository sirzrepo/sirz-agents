import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import loadingReducer from './loadingSlice';
import modalReducer from './modalSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    loading: loadingReducer,
    modal: modalReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 