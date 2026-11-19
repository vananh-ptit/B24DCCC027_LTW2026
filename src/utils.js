import { GRADES, RANKS } from './data';

export const getGrade = (score) => {
  return GRADES.find((g) => score >= g.min) || GRADES[GRADES.length - 1];
};

export const getRank = (gpa) => {
  const found = RANKS.find((r) => gpa >= r.min);
  return found ? found.title : 'Yếu';
};

export const calcStats = (courses) => {
  const count = courses.length;
  if (count === 0) {
    return { count: 0, credits: 0, points: 0, gpa: 0, rank: 'Chưa xếp loại' };
  }

  const { credits, points } = courses.reduce(
    (acc, course) => {
      const grade = getGrade(course.score);
      return {
        credits: acc.credits + course.credits,
        points: acc.points + course.credits * grade.point,
      };
    },
    { credits: 0, points: 0 }
  );

  const rawGpa = credits > 0 ? points / credits : 0;
  const gpa = Math.round(rawGpa * 100) / 100;
  const rank = getRank(gpa);

  return { count, credits, points, gpa, rank };
};

export const calcRequired = (courses, targetStr, remainingStr) => {
  const target = Number(targetStr);
  const remaining = Number(remainingStr);

  if (
    targetStr.trim() === '' ||
    remainingStr.trim() === '' ||
    Number.isNaN(target) ||
    target < 0 ||
    target > 4 ||
    !Number.isInteger(remaining) ||
    remaining < 1
  ) {
    return 'Hãy nhập GPA mục tiêu (0-4) và số tín chỉ còn lại (từ 1)';
  }

  const { credits, points } = calcStats(courses);
  const need = (target * (credits + remaining) - points) / remaining;

  if (need > 4) {
    return 'Không thể đạt mục tiêu này';
  }
  if (need <= 0) {
    return 'Bạn đã đạt mục tiêu';
  }
  return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${remaining} tín chỉ còn lại`;
};