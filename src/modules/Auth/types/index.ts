export interface ILoginPostData {
  username: string;
  password: string;
}
export interface ILoginResponse {
  phone_number: string;
}
export interface IRequestOtpPostData {
  type: string;
  address: string;
  purpose: string;
  client_secret: string;
}
export interface IRequestOtpResponse {
  sid: number;
  wait: number;
}
export interface IVerifyOtpPostData {
  sid: number;
  otp: string;
  client_secret: string;
}
export interface IVerifyOtpResponse {
  sid: number;
  validated: boolean;
}
export interface IFinishLoginPostData {
  username: string;
  password: string;
  phone_number: string;
  verification: {
    sid: number;
    client_secret: string;
  };
}
export interface IFinishLoginResponse {
  access: string;
  refresh: string;
}
export interface IUser {
  id: number;
  username: string;
  avatar: string;
  full_name: string;
  phone_number: string;
  role: "student" | "teacher" | "manager" | "admin" | "mentor";
  date_joined: string;
  is_active: boolean;
}
