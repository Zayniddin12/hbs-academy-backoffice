export interface ICourse {
  id: number;
  course: {
    id: number;
    name: string;
    image: string;
  };
  group: {
    name: string;
  };
  lesson_count: number;
  current_lesson: number;
  start_date: string;
  point: number;
  max_point: number;
  is_paid: boolean;
}

export interface IModule {
  id: number;
  completed_lessons_count: number;
  lessons_count: number;
  percent: number;
  duration: number;
  viewed_duration: number;
  start_date: number;
  end_date: number;
  submitted_assignments_count: number;
  assignments_count: number;
  is_available: boolean;
  details: {
    title: string;
    ordering: number;
  };
}

export interface IModuleLesson {
  received_ball: number;
  completed: boolean;
  viewed_duration: number;
  start_at: number;
  finish_at: number;
  details: {
    title: string;
    video_duration: number;
    ball: number;
    ordering: number;
  };
}

export interface ICourseDetail {
  id: number;
  details: {
    title: string;
    description: string;
    photo: string;
    modules_count: number;
    received_ball: number;
    ball: number;
  };
  is_paid: boolean;
  follow_name: string;
  group_name: string;
  modules: IModule[];
}

export interface IAssignment {
  id: number;
  details: {
    title: string;
    ball: number;
  };
  end_date: string;
  submitted: boolean;
  submitted_at: number;
  attempts_count: number;
  ball: number;
}

export interface IStudent {
  id: string;
  full_name: string;
  avatar: string;
  phone_number: string;
  course_count: number;
  region: string;
  date_joined: string;
  is_active: boolean;
  is_online: boolean;
  email?: string;
  gender?: string;
}
export interface ICourseDetail {
  title: string;
  description: string;
  photo: string;
}
export interface IStudentCourse {
  id: number;
  details: ICourseDetail;
  group_name: string;
  start_at: null | Date;
  finished_lessons_count: number;
  lessons_count: number;
  received_ball: number;
  ball: number;
  is_paid: boolean;
}
export interface IStudentCourseSingle {
  id: number;
  details: {
    title: string;
    description: string;
    photo: string;
    modules_count: number;
    received_ball: number;
    ball: number;
  };
  is_paid: boolean;
  flow_name: string;
  group_name: string;
  modules: [];
  gender: string;
  email: string;
}
