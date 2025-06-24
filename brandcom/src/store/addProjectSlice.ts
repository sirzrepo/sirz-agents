import { createSlice } from '@reduxjs/toolkit';

interface AddProjectState {
  isAddProjectPageActive: boolean;
}

const initialState: AddProjectState = {
    isAddProjectPageActive: false,
};

export const addProjectSlice = createSlice({
  name: 'addProject',
  initialState,
  reducers: {
    addProjectActive: (state) => {
      state.isAddProjectPageActive = true;
    },
    addProjectInactive: (state) => {
      state.isAddProjectPageActive = false;
    },
    },
});

export const { addProjectActive, addProjectInactive } = addProjectSlice.actions;
export default addProjectSlice.reducer; 