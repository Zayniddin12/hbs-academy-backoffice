import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import { IResponse } from "@/types/common";
import {
  ILeadGroup,
  ILeadRole,
  ILeadRoles,
  IWorker,
  IWorkerDetail,
} from "@/modules/Colleagues/types";

export const useWorkersStore = defineStore("workerStore", {
  state: () => ({
    workers: [] as IWorker[],
    worker: {} as IWorkerDetail,
    leadRoles: [] as ILeadRole[],
    leadGroups: [] as ILeadGroup[],
    loading: true,
    count: 0,
  }),
  actions: {
    fetchWorkers(params: {
      page: number;
      page_size: number;
      search: string | undefined;
      role?: string;
    }) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IResponse<IWorker>>("backoffice/WorkerList/", {
            params,
          })
          .then((response) => {
            this.workers = response.data.results;
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
    fetchWorkerDetails(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IWorkerDetail>("/backoffice/WorkerDetail/" + id, {})
          .then((response) => {
            this.worker = response.data;
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
    fetchLeadRoles() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<ILeadRoles>("/backoffice/LeadRoles/", {})
          .then((response) => {
            this.leadRoles = response.data?.roles;
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
    fetchLeadGroups(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query<IResponse<ILeadGroup>>("/backoffice/LeadGroups/", {
            params: {
              lead: id,
            },
          })
          .then((response) => {
            this.leadGroups = response.data.results;
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
    deleteWorker(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .delete("/backoffice/WorkerDelete/" + id)
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
  },
});
