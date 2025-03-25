export interface IAssignment {
  id: number;
  module: IModule;
  type: string;
  type_display: string;
  title: string;
  description: string;
  ball: number;
  allocated_time: string;
  files: IFiles[];
  test_questions: ITestQuestion[];
}

export interface IModule {
  id: number;
  title: string;
  course: ICourse;
}

export interface ICourse {
  id: number;
  title: string;
  photo: string;
}

export interface IFiles {
  id: string;
  file: string;
  file_type: string;
  file_type_display: string;
  size: number;
  size_display: string;
  file_name: string;
}

export interface ITestQuestion {
  id: string;
  answer_type: string;
  body: string;
  photo: IPhoto;
  video: string;
  answer_content: string;
  answers: IAnswer[];
}

export interface IAnswer {
  text: string;
  photo: IPhoto;
  is_correct: boolean;
}

export interface IPhoto {
  id: string;
  file: string;
  file_type: string;
  file_type_display: string;
  size: number;
  size_display: string;
  file_name: string;
}

export interface IStudentAssignmentFlows {
  id: number;
  name: string;
  students_count: number;
}

export interface IStudentAssignmentReject {
  id: number;
  name: string;
}

export interface IStudentAssignment {
  id: number;
  student_name: string;
  student_avatar: string;
  start_date: string;
  old_end_date: string;
  end_date: string;
  submitted: boolean;
  submitted_at: string;
  ball: number;
  test_started_at: string;
  test_finished_at: string;
  test_spent_time: number;
  test_stat_average_time: number;
  test_stat_min_time: number;
  test_stat_max_time: number;
  appraiser_name: string;
  assessment_at: string;
  details: {
    type: string;
    type_display: string;
    title: string;
    description: string;
    ball: number;
    files: IFiles[];
    allocated_time: string;
    questions_count: string;
  };
  flow: {
    id: number;
    name: string;
  };
  module: IModule;
  answer_text: string;
  answer_files: IFiles[];
  answer_questions: IAnswerQuestion[];
  answer_questions_correct_count: number;
}

export interface IAnswerQuestion {
  id: number;
  ball: number;
  is_answered: boolean;
  details: {
    body: string;
    photo: string;
    video: string;
    answer_type: string;
    answer_content: string;
    answers: string;
  };
}
