const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export const apiService = new ApiService();

// Contents API mappings
export const contentsApi = {
  // Food endpoints
  getFoods: () => apiService.get('/contents/food'),
  getFood: (code: string) => apiService.get(`/contents/food/${code}`),
  getFoodsByCategories: (params: {
    category1?: string;
    category2?: string;
    category3?: string;
    category4?: string;
    category5?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.category1) queryParams.append('category1', params.category1);
    if (params.category2) queryParams.append('category2', params.category2);
    if (params.category3) queryParams.append('category3', params.category3);
    if (params.category4) queryParams.append('category4', params.category4);
    if (params.category5) queryParams.append('category5', params.category5);
    return apiService.get(`/contents/food/search/by-categories?${queryParams.toString()}`);
  },
  createFood: (data: any) => apiService.post('/contents/food', data),
  updateFood: (code: string, data: any) => apiService.patch(`/contents/food/${code}`, data),
  deleteFood: (code: string) => apiService.delete(`/contents/food/${code}`),

  // Game endpoints
  getGames: () => apiService.get('/contents/game'),
  getGame: (code: string) => apiService.get(`/contents/game/${code}`),
  createGame: (data: any) => apiService.post('/contents/game', data),
  updateGame: (code: string, data: any) => apiService.patch(`/contents/game/${code}`, data),
  deleteGame: (code: string) => apiService.delete(`/contents/game/${code}`),

  // Quiz endpoints
  getQuizzes: () => apiService.get('/contents/quiz'),
  getQuiz: (code: string) => apiService.get(`/contents/quiz/${code}`),
  createQuiz: (data: any) => apiService.post('/contents/quiz', data),
  updateQuiz: (code: string, data: any) => apiService.patch(`/contents/quiz/${code}`, data),
  deleteQuiz: (code: string) => apiService.delete(`/contents/quiz/${code}`),

  // Common endpoints
  getContents: (type: string) => apiService.get(`/contents?type=${type}`),
  toggleStatus: (code: string) => apiService.patch(`/contents/${code}/status`, {}),
  batchUpsert: (items: any[]) => apiService.post('/contents/batch', { items }),
  
  // Common code endpoints
  getCommonCodes: (masterCode: string) => apiService.get(`/common-code/${masterCode}`),
  getCommonMaster: (masterCode: string) => apiService.get(`/common-code/master/${masterCode}`),
  getAllCommonMasters: () => apiService.get('/common-code'),
  
  // Common code management endpoints
  createCommonMaster: (data: any) => apiService.post('/contents/common/masters', data),
  updateCommonMaster: (seq: number, data: any) => apiService.patch(`/contents/common/masters/${seq}`, data),
  deleteCommonMaster: (seq: number) => apiService.delete(`/contents/common/masters/${seq}`),
  
  createCommonDetail: (data: any) => apiService.post('/contents/common/details', data),
  updateCommonDetail: (seq: number, data: any) => 
    apiService.patch(`/contents/common/details/${seq}`, data),
  deleteCommonDetail: (seq: number) => 
    apiService.delete(`/contents/common/details/${seq}`),
  
  getCommonDetailsByMaster: (masterCode: string) => 
    apiService.get(`/contents/common/details/${masterCode}`),
};
