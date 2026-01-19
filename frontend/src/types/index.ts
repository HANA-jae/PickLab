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

// ---- Menu/Properties Types ----
export type TabType = 'lunch' | 'dinner' | 'recipe';

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  emoji: string;
  rating: string;
  category: string;
  subCategory: string;
  taste: string;
  priceRange: string;
  feature: string;
  tab?: TabType; // optional: Admin 입력 시 탭 보존
}

export interface MenuProperties {
  menus: Record<TabType, FoodItem[]>;
  updatedAt: number;
}
