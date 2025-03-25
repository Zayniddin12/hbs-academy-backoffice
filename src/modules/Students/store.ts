import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import { IResponse } from "@/types/common";
import {
  IAssignment,
  ICourse,
  ICourseDetail,
  IModuleLesson,
  IStudent,
  IStudentCourse,
  IStudentCourseSingle,
} from "@/modules/Students/types";

export const useStudentsStore = defineStore("studentStore", {
  state: () => ({
    students: [] as IStudent[],
    student: {} as IStudent,
    courses: [] as ICourse[],
    course: {} as IStudentCourseSingle,
    moduleLessons: [] as IModuleLesson[],
    assignments: [] as IAssignment[],
    single: {} as IStudent,
    courses: [] as IStudentCourse[],
    coursesCount: 0,
    courseLoading: true,
    loading: true,
    count: 0,
  }),
  actions: {
    fetchStudents(params: {
      page: number;
      page_size: number;
      search: string | undefined;
      groups_members__flow__course?: string | undefined;
      groups_members__group?: string | undefined;
      groups_members__group__leads__lead?: string | undefined;
      is_new: boolean | undefined;
    }) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IResponse<IStudent>>("backoffice/StudentList/", {
            params,
          })
          .then((response) => {
            this.students = response.data.results;
            this.count = response.data.count;
            this.loading = false;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    fetchGroupLeads(params: {
      page: number;
      page_size: number;
      search: string | undefined;
    }) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IResponse<IStudent>>("backoffice/GroupLeadsList/", {
            params,
          })
          .then((response) => {
            this.students = response.data.results;
            this.count = response.data.count;
            this.loading = false;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    fetchCourseList(params: {
      page: number;
      page_size: number;
      search: string | undefined;
    }) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IResponse<IStudent>>("backoffice/CoursesList/", {
            params,
          })
          .then((response) => {
            this.students = response.data.results;
            this.count = response.data.count;
            this.loading = false;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    fetchGroupsList(params: {
      page: number;
      page_size: number;
      search: string | undefined;
    }) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IResponse<IStudent>>("backoffice/GroupsList/", {
            params,
          })
          .then((response) => {
            this.students = response.data.results;
            this.count = response.data.count;
            this.loading = false;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    fetchStudent(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IStudent>("/backoffice/StudentDetail/" + id, {})
          .then((response) => {
            this.student = response.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    deleteStudent(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .delete("/backoffice/StudentDelete/" + id)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    updateStudent(student: IStudent) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .put("/backoffice/StudentUpdate/" + student?.id + "/", {
            full_name: student?.full_name,
            phone_number: student?.phone_number,
            is_active: !student?.is_active,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    updateStudentUsername(id: number, username: string, phoneNumber: string) {
      return new Promise((resolve, reject) => {
        apiService
          .put("/backoffice/StudentUpdate/" + id + "/", {
            full_name: username,
            phone_number: phoneNumber,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    resetStudentPassword(id: string, data: any) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .post("/backoffice/ResetPassword/", {
            id: id,
            new_password: data?.new_password,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    resetStudentPhoneNumber(id: string, data: any) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .post("/backoffice/ChangeStudentPhoneNumber/", {
            id: id,
            new_phone: data?.new_phone,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    fetchStudentCourses(params: any) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IResponse<IStudentCourse>>("/backoffice/StudentCourses/", {
            params,
          })
          .then((response) => {
            this.courses = response.data.results;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    fetchStudentCourseDetail(
      id: string,
      params: {
        page: number;
        page_size: number;
        search: string | undefined;
      }
    ) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IStudentCourseSingle>(
            "/backoffice/StudentCourseDetail/" + id,
            {
              params,
            }
          )
          .then((response) => {
            this.course = response.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
});
