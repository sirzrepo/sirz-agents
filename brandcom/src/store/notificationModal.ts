import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  modalId?: string | null;
}

const initialState: ModalState = {
    isOpen: false,
    modalId: null,
};

export const notificationModalSlice = createSlice({
  name: 'notificationModal',
  initialState,
  reducers: {
    openNotificationModal: (state, action: PayloadAction<string | null>) => {
      state.isOpen = true;
      state.modalId = action.payload; // Stores the modal ID if provided
    },
    onCloseNotificationModal: (state) => {
      state.isOpen = false;
      state.modalId = null;
    },
    },
});

export const { openNotificationModal, onCloseNotificationModal } = notificationModalSlice.actions;
export default notificationModalSlice.reducer; 