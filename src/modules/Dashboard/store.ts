import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import { IMainInfo } from "@/modules/Dashboard/types";

export const useDashboardStore = defineStore("dashboardStore", {
  state: () => ({
    data: {} as IMainInfo,
    loading: true,
  }),
  actions: {
    fetchMainData() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .get<IMainInfo>("backoffice/MainInfo")
          .then((response) => {
            this.data = response.data;
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
