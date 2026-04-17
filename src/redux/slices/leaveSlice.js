import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabase/supabaseClient';

// 1. Student: Apni leaves fetch karega
export const fetchMyLeaves = createAsyncThunk('leaves/fetchMine', async (studentId) => {
  const { data, error } = await supabase
    .from('leaves')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false }); // Updated column name

  if (error) throw error;
  return data;
});

// 2. Student: Nayi leave apply karega
export const applyForLeave = createAsyncThunk('leaves/apply', async (leaveData) => {
  const { data, error } = await supabase
    .from('leaves')
    .insert([leaveData])
    .select();
    
  if (error) throw error;
  return data[0];
});

// 3. Admin: Sab students ki leaves fetch karega
export const fetchAllLeaves = createAsyncThunk('leaves/fetchAll', async () => {
  const { data, error } = await supabase
    .from('leaves')
    .select('*')
    .order('created_at', { ascending: false }); // Updated column name

  if (error) throw error;
  return data;
});

// 4. Admin: Leave ka status update karega
export const updateLeaveStatus = createAsyncThunk('leaves/updateStatus', async ({ id, status }) => {
  const { data, error } = await supabase
    .from('leaves')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
});

const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLeaves.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllLeaves.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(applyForLeave.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default leaveSlice.reducer;