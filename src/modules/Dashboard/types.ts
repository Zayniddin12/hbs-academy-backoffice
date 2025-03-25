export interface IMainInfo {
  average_student_mark: number;
  courses_count: number;
  managers_count: number;
  teachers_count: number;
  mentors_count: number;
  students_count: number;
  new_students_count: number;
  groups_count: number;
  popular_courses: IPopularCourse[];
  students_academic_performance: 0;
}

interface IPopularCourse {
  course_title: string;
  students_count: number;
  percentage: number;
}
