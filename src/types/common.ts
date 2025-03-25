type TClass =
  | string
  | string[]
  | Record<string, boolean>
  | Record<string, boolean>[];

export type TClassName = TClass | TClass[];

export interface IResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export interface ICompany {
  title: string;
  isVerified: true;
  rating: number;
  commentsCount: number;
  categories: {
    title: string;
    slug: string;
  }[];
  about_company: string;
  work_time: string;
  work_days: string[];
  not_work_days: string[];
  site: string;
  email: string;
  phone: string;
  address: string;
}

export interface TErrors {
  status_code: 400 | 401 | 403 | 500 | 502;
  errors: {
    error: string;
    message: string;
  }[];
}

export interface IVdoCipher {
  video_id: string;
  upload_link: string;
  x_amz_credential: string;
  x_amz_algorithm: string;
  x_amz_date: string;
  x_amz_signature: string;
  key: string;
  policy: string;
}

export interface FormData {
  file: File | null;
  password: string;
}
