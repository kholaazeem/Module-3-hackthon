import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabase/supabaseClient'; 

// 1. Student kisi course mein apply karta hai
export const applyForCourse = createAsyncThunk('enrollments/apply', async (enrollmentData) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert([enrollmentData])
    .select();
    
  if (error) throw error;
  return data[0];
});

// 2. Student apni applications check karta hai (taake pata chale kis mein apply kar chuka hai)
export const fetchMyEnrollments = createAsyncThunk('enrollments/fetchMine', async (studentId) => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('student_id', studentId);
    
  if (error) throw error;
  return data;
});

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch My Enrollments
      .addCase(fetchMyEnrollments.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Apply For Course
      .addCase(applyForCourse.fulfilled, (state, action) => {
        state.items.push(action.payload); // Nayi application state mein add kardo
      });
  }
});

export default enrollmentSlice.reducer;