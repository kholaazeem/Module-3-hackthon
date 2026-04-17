import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabase/supabaseClient';

// Fetch all announcements (For both Admin and Student)
export const fetchAnnouncements = createAsyncThunk('announcements/fetchAll', async () => {
  const { data, error } = await supabase
    .from('Announcements') // <-- Ye capital 'A' ke sath update kar diya gaya hai
    .select('*')
    .order('created_at', { ascending: false }); // Newest first

  if (error) throw error;
  return data;
});

// Add a new announcement (Admin use)
export const addAnnouncement = createAsyncThunk('announcements/add', async (announcementData) => {
  const { data, error } = await supabase
    .from('Announcements') // <-- Ye bhi update kar diya gaya hai
    .insert([announcementData])
    .select();

  if (error) throw error;
  return data[0];
});

const announcementSlice = createSlice({
  name: 'announcements',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addAnnouncement.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export default announcementSlice.reducer;