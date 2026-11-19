import React, { useReducer, useEffect, useState, useMemo, useRef } from 'react';
import { SEMESTERS, CREDIT_OPTIONS, formatPoint } from './data';
import { useFetch } from './hooks/useFetch';
import { getGrade, calcStats } from './utils';
import { coursesReducer } from './coursesReducer';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const [courses, dispatch] = useReducer(coursesReducer, []);
  const [semesterFilter, setSemesterFilter] = useState('all');

  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  const codeInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  const filteredCourses = useMemo(() => {
    if (semesterFilter === 'all') return courses;
    return courses.filter((c) => c.semester === semesterFilter);
  }, [courses, semesterFilter]);

  const viewStats = useMemo(() => calcStats(filteredCourses), [filteredCourses]);
  const totalStats = useMemo(() => calcStats(courses), [courses]);

  const handleScoreChange = (id, e) => {
    const val = e.target.valueAsNumber;
    if (!Number.isNaN(val) && val >= 0 && val <= 10) {
      dispatch({ type: 'SET_SCORE', payload: { id, score: val } });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const parsedScore = Number(score);

    if (!trimmedCode) {
      nextErrors.code = 'Hãy nhập mã môn';
    } else if (courses.some((c) => c.code.toLowerCase() === trimmedCode.toLowerCase())) {
      nextErrors.code = 'Mã môn đã tồn tại';
    }

    if (!trimmedName) {
      nextErrors.name = 'Hãy nhập tên môn';
    }

    if (score === '' || Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      nextErrors.score = 'Điểm phải từ 0 đến 10';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        code: trimmedCode.toUpperCase(),
        name: trimmedName,
        credits: Number(credits),
        semester,
        score: parsedScore,
      },
    });

    setCode('');
    setName('');
    setCredits(3);
    setSemester(SEMESTERS[0]);
    setScore('');
    setErrors({});
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  };

  return (
    <div className="app light" data-build="TH03">
      <div className="container">
        <h1>Sổ điểm sinh viên</h1>

        {loading && <p>Đang tải bảng điểm...</p>}
        {error && <p>Không tải được bảng điểm</p>}

        {}
        <section>
          <h2>Thống kê</h2>
          <p>Số môn: {viewStats.count}</p>
          <p>Tổng tín chỉ: {viewStats.credits}</p>
          <p>GPA (hệ 4): {viewStats.gpa.toFixed(2)}</p>
          <p>Xếp loại: {viewStats.rank}</p>
          <p>GPA tích lũy: {totalStats.gpa.toFixed(2)}</p>
        </section>

        {}
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
          </div>

          {filteredCourses.length === 0 ? (
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
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const grade = getGrade(course.score);
                  const isFail = grade.letter === 'F';
                  return (
                    <tr key={course.id} className={isFail ? 'fail-row' : ''}>
                      <td>{course.code}</td>
                      <td>{course.name}</td>
                      <td>{course.credits}</td>
                      <td>{course.semester}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          aria-label={`Điểm ${course.name}`}
                          value={course.score}
                          onChange={(e) => handleScoreChange(course.id, e)}
                        />
                      </td>
                      <td>{isFail ? 'F – Học lại' : grade.letter}</td>
                      <td>{formatPoint(grade.point)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'REMOVE', payload: course.id })}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        {}
        <section>
          <h2>Thêm môn học</h2>
          <form onSubmit={handleAddSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="course-code">Mã môn</label>
              <input
                id="course-code"
                ref={codeInputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {errors.code && (
                <div role="alert" className="error-text">
                  {errors.code}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="course-name">Tên môn</label>
              <input
                id="course-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <div role="alert" className="error-text">
                  {errors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="course-credits">Số tín chỉ</label>
              <select
                id="course-credits"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
              >
                {CREDIT_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course-semester">Học kỳ</label>
              <select
                id="course-semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course-score">Điểm hệ 10</label>
              <input
                id="course-score"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              {errors.score && (
                <div role="alert" className="error-text">
                  {errors.score}
                </div>
              )}
            </div>

            <button type="submit">Thêm môn</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default App;