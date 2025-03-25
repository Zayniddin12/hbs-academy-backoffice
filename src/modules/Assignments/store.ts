import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import {
  IStudentAssignment,
  IStudentAssignmentFlows,
  IStudentAssignmentReject,
} from "@/modules/Assignments/types";

export const useAssignmentStore = defineStore("assignmentStore", {
  state: () => ({
    studentAssignment: {} as IStudentAssignment,
    studentAssignmentFlowsList: {} as IStudentAssignmentFlows,
    studentAssignmentMentorList: {},
    studentAssignmentRejectList: {} as IStudentAssignmentReject,
    studentAssignmentSingleList: {},
    loading: true,
    downloading: true,
    count: 0,
    allIds: [],
  }),
  actions: {
    fetchStudentAssignmentDetails(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IStudentAssignment>(
            "/backoffice/assignment/StudentAssignmentDetail/" + id,
            {}
          )
          .then((response) => {
            this.studentAssignment = response.data;
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
    fetchCourseAssignmentFlowsLIst(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IStudentAssignment>(
            "/backoffice/assignment/AssignmentFlowsList/" + id + "/",
            {}
          )
          .then((response) => {
            this.studentAssignmentFlowsList = response.data;
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
    fetchCourseAssignmentMentorSingle(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IStudentAssignment>("/backoffice/GroupStudents/" + id, {})
          .then((response) => {
            this.studentAssignmentMentorList = response.data;
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
    fetchCourseAssignmentRejectList() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IStudentAssignment>(
            "/backoffice/assignment/StudentAssignmentRejectReasons/",
            {}
          )
          .then((response) => {
            this.studentAssignmentRejectList = response.data;
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
    fetchStudentAssignmentStudentList(gid: any, id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .get<IStudentAssignment>(
            "/backoffice/assignment/StudentAssignmentsList/" +
              id +
              "/" +
              "?group_member__group=" +
              gid
          )
          .then((response) => {
            this.studentAssignmentSingleList = response.data;
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
