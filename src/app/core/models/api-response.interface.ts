export interface ApiResponseInterface<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
