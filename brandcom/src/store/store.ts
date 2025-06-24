import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import loadingReducer from './loadingSlice';
import modalReducer from './modalSlice';
import userReducer from './userSlice';
import notificationModalReducer from './notificationModal';
import brandReducer from './brandSlice';
import addProjectReducer from './addProjectSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    loading: loadingReducer,
    modal: modalReducer,
    user: userReducer,
    notificationModal: notificationModalReducer,
    brand: brandReducer,
    addProject: addProjectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 