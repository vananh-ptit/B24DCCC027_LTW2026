import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    setCourses: (state, action) => [...action.payload],
    addCourse: (state, action) => {
      const maxId = state.reduce((max, item) => (item.id > max ? item.id : max), 0);
      state.push({ ...action.payload, id: maxId + 1 });
    },
    removeCourse: (state, action) => state.filter((item) => item.id !== action.payload),
    setScore: (state, action) => {
      const target = state.find((item) => item.id === action.payload.id);
      if (target) {
        target.score = action.payload.score;
      }
    },
  },
});

export const { setCourses, addCourse, removeCourse, setScore } = coursesSlice.actions;
export const selectCourses = (state) => state.courses;
export default coursesSlice.reducer;