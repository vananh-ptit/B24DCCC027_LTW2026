import React, { useState } from 'react';

function App() {
  // Khởi tạo danh sách sinh viên ban đầu
  const [students, setStudents] = useState([
    { name: 'Nguyễn Văn A', score: 8.5 },
    { name: 'Trần Thị B', score: 4 },
  ]);

  // State lưu giá trị từ ô nhập liệu
  const [nameInput, setNameInput] = useState('');
  const [scoreInput, setScoreInput] = useState('');

  // Hàm xử lý khi bấm nút "Thêm sinh viên"
  const handleAddStudent = () => {
    if (!nameInput.trim() || scoreInput === '') {
      alert('Vui lòng nhập đầy đủ tên và điểm số!');
      return;
    }

    const newStudent = {
      name: nameInput,
      score: parseFloat(scoreInput),
    };

    setStudents([...students, newStudent]);
    setNameInput('');
    setScoreInput('');
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#a00000' }}>Xin chao!!!</h1>

      <h2>Quản lý điểm sinh viên</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tên sinh viên"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ marginRight: '8px', padding: '5px' }}
        />
        <input
          type="number"
          placeholder="Điểm số"
          value={scoreInput}
          onChange={(e) => setScoreInput(e.target.value)}
          style={{ marginRight: '8px', padding: '5px' }}
        />
        <button onClick={handleAddStudent} style={{ padding: '5px 10px' }}>
          Thêm sinh viên
        </button>
      </div>

      <ul>
        {students.map((student, index) => {
          // Tự động kiểm tra Đạt (>= 5) hay Trượt (< 5)
          const status = student.score >= 5 ? 'Đạt' : 'Trượt';
          return (
            <li key={index} style={{ marginBottom: '5px' }}>
              Họ tên: {student.name} - Điểm: {student.score} ({status})
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
