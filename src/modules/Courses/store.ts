import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import { IResponse, IVdoCipher } from "@/types/common";
import { ICourse, IWorker } from "@/modules/Courses/types";
import ApiService from "@/services/ApiService";

export const useCoursesStore = defineStore("courseStore", {
  state: () => ({
    workers: [] as IWorker[],
    single: {} as ICourse,
    courseSingle: {} as ICourse,
    loading: true,
    vdoCipherData: {} as IVdoCipher,
  }),
  actions: {
    fetchWorkers(search: string, page_size?: number) {
      return new Promise((resolve, reject) => {
        apiService
          .query<IResponse<IWorker>>("backoffice/WorkerList/", {
            params: {
              search,
              page_size,
            },
          })
          .then((response) => {
            this.workers = response.data.results;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setSingle(payload: ICourse) {
      this.single = payload;
      sessionStorage.setItem("courseTitle", payload?.title ?? "");
    },
    fetchSingleCourse(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        ApiService.get<ICourse>(`/backoffice/Courses/${id}`)
          .then((res) => {
            this.courseSingle = res.data;
            resolve(res);
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
