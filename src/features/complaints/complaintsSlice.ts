import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { ComplaintListDto } from './complaintTypes';

import { logout } from '../auth/authSlice';

export const fetchComplaints = createAsyncThunk<ComplaintListDto[], void, { rejectValue: string }> ('complaints/fetchComplaints', async (_, thunkApi) => {
  try {
    const res = await api.get<ComplaintListDto[]>('/complaints');
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      thunkApi.dispatch(logout()); 
      return thunkApi.rejectWithValue('Sessão expirada. Faça login novamente.');
    }
    return thunkApi.rejectWithValue(err.message);
  }
});


interface ComplaintsState {
  list: ComplaintListDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ComplaintsState = {
  list: [],
  status: 'idle',
  error: null,
};

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchComplaints.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message!;
      });
  },
});

export default complaintsSlice.reducer;
