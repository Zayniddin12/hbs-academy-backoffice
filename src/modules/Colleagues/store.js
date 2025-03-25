import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
export const useWorkersStore = defineStore("workerStore", {
  state: () => ({
    workers: [],
    worker: {},
    leadRoles: [],
    leadGroups: [],
    loading: true,
    count: 0,
  }),
  actions: {
    fetchWorkers(params) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query("backoffice/WorkerList/", {
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
    fetchWorkerDetails(id) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query("/backoffice/WorkerDetail/" + id, {})
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
          .query("/backoffice/LeadRoles/", {})
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
    fetchLeadGroups(id) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        apiService
          .query("/backoffice/LeadGroups/", {
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
    deleteWorker(id) {
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
//# sourceMappingURL=store.js.map
