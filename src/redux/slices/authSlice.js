import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, 
  role: null, 
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Ye function ab wapas aagaya hai jo aapke LoginPage ko chahiye!
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    // Navbar aur Layout ke liye logout function
    logoutUser: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

// Dono ko export kar diya
export const { loginSuccess, logoutUser } = authSlice.actions;
export default authSlice.reducer;