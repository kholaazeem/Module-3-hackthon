import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabase/supabaseClient'; 

// Fetch Courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
});

// Add Course
export const addCourse = createAsyncThunk('courses/addCourse', async (courseData) => {
  const { data, error } = await supabase.from('courses').insert([courseData]).select();
  if (error) throw error;
  return data[0];
});

// Update Course (Edit & Status Toggle ke liye)
export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ id, ...updates }) => {
  const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
});

// Delete Course
export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id) => {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
  return id; // Return ID so we can remove it from state
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    items: [],
    status: 'idle', 
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCourses.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add
      .addCase(addCourse.fulfilled, (state, action) => {
        state.items.unshift(action.payload); 
      })
      // Update
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  }
});

export default courseSlice.reducer;