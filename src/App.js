import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SEMESTERS, GRADES } from './data';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { getGrade, calcStats } from './utils';
import { setCourses, removeCourse, setScore, selectCourses } from './features/coursesSlice';
import { hasSaved } from './store';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import CourseRow from './components/CourseRow';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [semesterFilter, setSemesterFilter] = useLocalStorage('ltw_sodiem_semester', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const searchInputRef = useRef(null);
  const didInitialLoad = useRef(false);

  useEffect(() => {
    if (!hasSaved && data && !didInitialLoad.current) {
      didInitialLoad.current = true;
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  // Lọc theo học kỳ (dùng cho cả thống kê và phân bố điểm chữ)
  const semesterCourses = useMemo(() => {
    if (semesterFilter === 'all') return courses;
    return courses.filter((c) => c.semester === semesterFilter);
  }, [courses, semesterFilter]);

  // Lọc tiếp theo từ khóa tìm kiếm đã debounce (chỉ dùng cho bảng)
  const displayedCourses = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (!keyword) return semesterCourses;
    return semesterCourses.filter(
      (c) => c.name.toLowerCase().includes(keyword) || c.code.toLowerCase().includes(keyword)
    );
  }, [semesterCourses, debouncedSearch]);

  const viewStats = useMemo(() => calcStats(semesterCourses), [semesterCourses]);
  const totalStats = useMemo(() => calcStats(courses), [courses]);

  // Phân bố điểm chữ theo học kỳ đang xem
  const gradeDistribution = useMemo(() => {
    const counts = GRADES.reduce((acc, g) => {
      acc[g.letter] = 0;
      return acc;
    }, {});

    semesterCourses.forEach((course) => {
      const { letter } = getGrade(course.score);
      counts[letter] += 1;
    });

    return GRADES.map((g) => ({
      letter: g.letter,
      count: counts[g.letter],
    }));
  }, [semesterCourses]);

  // Cập nhật tiêu đề tab
  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${totalStats.gpa.toFixed(2)} – Sổ điểm`;
    } else {
      document.title = 'Sổ điểm';
    }
  }, [courses.length, totalStats.gpa]);

  // Phím tắt / và Esc
  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleCourseShift = (e) => {
    setSearch(e.target.value);
  };

  const handleScoreChange = useCallback(
    (id, e) => {
      const val = e.target.valueAsNumber;
      if (!Number.isNaN(val) && val >= 0 && val <= 10) {
        dispatch(setScore({ id, score: val }));
      }
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (course) => {
      dispatch(removeCourse(course.id));
      showNotice(`Đã xóa môn ${course.name}`);
    },
    [dispatch, showNotice]
  );

  const handleResetSample = () => {
    if (data) {
      dispatch(setCourses(data));
      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  };

  return (
    <div className={`app ${theme}`} data-build="TH03">
      <div className="container">
        <h1>Sổ điểm sinh viên</h1>
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>

        {!hasSaved && loading && <p>Đang tải bảng điểm...</p>}
        {!hasSaved && error && <p>Không tải được bảng điểm</p>}

        {/* Khu vực Thống kê */}
        <section>
          <h2>Thống kê</h2>
          <p>Số môn: {viewStats.count}</p>
          <p>Tổng tín chỉ: {viewStats.credits}</p>
          <p>GPA (hệ 4): {viewStats.gpa.toFixed(2)}</p>
          <p>Xếp loại: {viewStats.rank}</p>
          <p>GPA tích lũy: {totalStats.gpa.toFixed(2)}</p>

          <h3>Phân bố điểm chữ</h3>
          <ul>
            {gradeDistribution.map((item) => (
              <li key={item.letter}>
                {item.letter}: {item.count}
                <span
                  className="grade-bar"
                  style={{ width: `${item.count * 24}px` }}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Khu vực Bảng điểm */}
        <section>
          <h2>Bảng điểm</h2>
          <div>
            <label htmlFor="semester-filter">Xem học kỳ: </label>
            <select
              id="semester-filter"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>

            <label htmlFor="course-search" style={{ marginLeft: '16px' }}>
              Tìm môn học:{' '}
            </label>
            <input
              id="course-search"
              ref={searchInputRef}
              type="text"
              placeholder="Nhấn / để tìm..."
              value={search}
              onChange={handleCourseShift}
            />
          </div>

          <p>Tìm thấy {displayedCourses.length} môn</p>

          {displayedCourses.length === 0 ? (
            <p>Chưa có môn học nào</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Tên môn</th>
                  <th>Tín chỉ</th>
                  <th>Học kỳ</th>
                  <th>Điểm (hệ 10)</th>
                  <th>Điểm chữ</th>
                  <th>Điểm (hệ 4)</th>
                  <th>Số lần render</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {displayedCourses.map((course) => (
                  <CourseRow
                    key={course.id}
                    course={course}
                    onScore={handleScoreChange}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: '12px' }}>
            <button type="button" onClick={handleResetSample}>
              Đặt lại dữ liệu mẫu
            </button>
          </div>
        </section>

        <AddCourseForm />
        <GoalPlanner />
      </div>
    </div>
  );
};

export default App;