import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserState, User } from '../../../types';
import { simulateAPICall } from '../../../utils/testDataGenerator';

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    return simulateAPICall<User>('login', {
      id: 1,
      name: 'John Doe',
      email: credentials.email
    });
  }
);

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;