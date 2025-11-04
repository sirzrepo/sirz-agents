import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  modalId?: string | null;
}

const initialState: ModalState = {
    isOpen: false,
    modalId: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string | null>) => {
      state.isOpen = true;
      state.modalId = action.payload; // Stores the modal ID if provided
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalId = null;
    },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer; 