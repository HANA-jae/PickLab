// Type definitions for PickLab
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
