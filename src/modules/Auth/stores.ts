import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import { useClientSecret } from "@/composables/useClientSecretToken";
import {
  IFinishLoginPostData,
  IFinishLoginResponse,
  ILoginPostData,
  ILoginResponse,
  IRequestOtpPostData,
  IRequestOtpResponse,
  IUser,
  IVerifyOtpPostData,
} from "@/modules/Auth/types";
import { JwtService } from "@/services/JwtService";
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: {} as IUser,
    loginResponse: {} as ILoginResponse,
    requestOtpResponse: {} as IRequestOtpResponse,
    profileLoading: true,
    blockedTime: 0,
  }),
  actions: {
    login(params: ILoginPostData) {
      return new Promise((resolve, reject) => {
        apiService
          .post<ILoginPostData, ILoginResponse>(
            "backoffice/WorkerEntryLogin/",
            {
              username: params.username,
              password: params.password,
            }
          )
          .then((res) => {
            this.loginResponse = res.data;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    requestOtp() {
      const { secretId } = useClientSecret();
      return new Promise((resolve, reject) => {
        apiService
          .post<IRequestOtpPostData, IRequestOtpResponse>(
            "verification/request-otp/",
            {
              type: "phone",
              address: this.loginResponse.phone_number,
              purpose: "login",
              client_secret: secretId as string,
            }
          )
          .then((res) => {
            this.requestOtpResponse = res.data;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    verifyOtp(otp: string) {
      return new Promise((resolve, reject) => {
        apiService
          .post<IVerifyOtpPostData>("verification/submit-otp/", {
            sid: this.requestOtpResponse.sid,
            otp: otp,
            client_secret: useClientSecret().secretId as string,
          })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    finishLogin(form: ILoginPostData) {
      return new Promise((resolve, reject) => {
        apiService
          .post<IFinishLoginPostData, IFinishLoginResponse>(
            "backoffice/WorkerFinishLogin/",
            {
              username: form.username,
              password: form.password,
              phone_number: this.loginResponse.phone_number,
              verification: {
                sid: this.requestOtpResponse.sid,
                client_secret: useClientSecret().secretId as string,
              },
            }
          )
          .then((res) => {
            JwtService.saveToken(res.data.access);
            JwtService.saveRefreshToken(res.data.refresh);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    fetchUserData() {
      apiService.setHeader();
      this.profileLoading = true;
      return new Promise((resolve, reject) => {
        apiService
          .get<IUser>("backoffice/WorkerMyProfile/")
          .then((res) => {
            this.user = res.data;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            setTimeout(() => {
              this.profileLoading = false;
            }, 500);
          });
      });
    },
    logout() {
      JwtService.destroyAccess();
      JwtService.destroyRefresh();
      apiService.setHeader();
      this.user = {} as IUser;
    },
  },
});
