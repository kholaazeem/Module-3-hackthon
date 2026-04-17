import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import leaveReducer from './slices/leaveSlice';
import announcementReducer from './slices/announcementSlice'; // <-- 1. Import

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    enrollments: enrollmentReducer,
    leaves: leaveReducer,
    announcements: announcementReducer, // <-- 2. Add to store
  },
});

export default store;