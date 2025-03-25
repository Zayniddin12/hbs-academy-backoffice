export type WorkersRole = "manager" | "teacher" | "leader" | "admin";

export interface IWorker {
  id: number;
  full_name: string;
  avatar: string;
  username: string;
  phone_number: string;
  role: string;
  is_online: string;
}

export interface IWorkerDetail {
  id: number;
  full_name: string;
  avatar: string;
  username: string;
  phone_number: string;
  role: string;
  data_joined: string;
  is_active: boolean;
}

export interface ILeadRoles {
  roles: ILeadRole[];
}

export interface ILeadRole {
  value: string;
  label: string;
}

export interface ILeadGroup {
  id: number;
  group_title: string;
  course_photo: string;
  course_title: string;
  course_students_avg_ball: number;
  course_ball: number;
  start_date: string;
  end_date: string;
  student_count: number;
}
