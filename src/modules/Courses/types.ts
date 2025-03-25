export interface ICourseList {
  id: number;
  details: {
    title: string;
    description: string;
    photo: string;
  };
  group_name: string;
  progress: number;
  start_at: null;
  modules_count: number;
  finished_modules_count: number;
  received_ball: number;
  ball: number;
  is_paid: boolean;
}

export interface ICourse {
  title: string;
  description: string;
  photo: string;
  created_at: Date;
  students_count: number;
  lessons_count: number;
  assignments_count: number;
  modules_count: number;
  total_duration: number;
}

export interface IModuleSingle {
  id: number;
  title: string;
  photo: string;
  photo_url: string;
  duration_days: number;
  lessons_count: number;
  assignments_count: number;
  duration: null | number;
  can_edit_duration_days: {
    can: boolean;
    message: string;
  };
}

export interface ILessonSingle {
  id: number;
  title: string;
  description: string;
  video: string | null;
  ball: number;
  preview: string;
  status: string;
  percent: number;
  ordering: number;
  video_duration: number;
  is_attended: boolean;
  lesson_files: {
    id: number;
    file: string;
    ordering: number;
  }[];
  module: {
    id: number;
    title: string;
    lessons_count: number;
    assignments_count: number;
    duration_days: number;
  };
}

export interface IAssignmentSingle {
  id: number;
  module: {
    id: number;
    title: string;
    course: {
      id: number;
      title: string;
    };
  };
  type: "file" | "writing" | "test" | "writing_and_file";
  type_display: string;
  title: string;
  description: string;
  ball: number;
  allocated_time: null;
  files: {
    id: string;
    file: string;
    file_type: string;
    file_type_display: string;
    size: number;
    size_display: string;
    file_name: string;
  }[];
  test_questions: any[];
}

export interface IWorker {
  id: string;
  full_name: string;
  avatar: string;
  username: string;
  phone_number: string;
  role: string;
  is_online: boolean;
  is_active: boolean;
}
