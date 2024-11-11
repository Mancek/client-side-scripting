import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token');
let decodedUser = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    decodedUser = decoded.email;
  } catch (error) {
    console.error('Failed to decode token:', error);
    localStorage.removeItem('token');
  }
}

const initialState = {
  user: decodedUser,
  token: token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      const token = payload.access_token;
      const decodedToken = jwtDecode(token);
      
      state.token = token;
      state.user = decodedToken.email;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;